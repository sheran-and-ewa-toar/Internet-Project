const { success, error } = require('../utils/responseHelpers');
const { Job, User, FeatureFilter, JobFilter, sequelize } = require('../models');
const axios = require("axios");

const FASTAPI_URL = process.env.FASTAPI_SERVICE_URL || "http://localhost:8000";

const FEATURE_SET_MAP = {
    1: "1d",
    2: "2d",
    3: "3d",
    4: "1d_2d",
    5: "1d_3d",
    6: "2d_3d",
    7: "all"
};

const MODEL_MAP = {
    1: "RF",
    2: "XGB"
};

// 1. GET ALL JOBS (With strict role-based visibility filters)
const getAllJobs = async (req, res) => {
    try {
        const role = req.userRole;
        const userId = req.userId;

        if (!role) {
            return res
                .status(403)
                .json(error('FORBIDDEN', 'Missing user role header.'));
        }

        const queryOptions = {
            order: [['jobId', 'DESC']],

            include: [
                {
                    model: FeatureFilter,
                    as: "appliedFilters",
                    attributes: [
                        "filterId",
                        "name",
                        "shortName"
                    ],
                    through: {
                        attributes: ["thresholdValue"]
                    }
                }
            ]
        };

        // role-based filtering
        if (role === 'user') {
            queryOptions.where = { userId };
        }

        const jobs = await Job.findAll(queryOptions);

        return res.status(200).json(success(jobs));

    } catch (err) {
        return res.status(500).json(
            error('INTERNAL_ERROR', 'Failed to retrieve jobs: ' + err.message)
        );
    }
};

// 2. GET JOB BY ID (With safety ownership verification)
const getJobById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res
                .status(400)
                .json(error('VALIDATION_ERROR', 'Invalid job id'));
        }

        const job = await Job.findByPk(id, {
            include: [
                {
                    model: FeatureFilter,
                    as: "appliedFilters",
                    attributes: [
                        "filterId",
                        "name",
                        "shortName"
                    ],
                    through: {
                        attributes: ["thresholdValue"]
                    }
                }
            ]
        });

        if (!job) {
            return res
                .status(404)
                .json(error('NOT_FOUND', 'Job not found'));
        }

        // standard users can't see into other accounts' runs
        if (req.userRole === 'user' && req.userId !== job.userId) {
            return res
                .status(403)
                .json(error(
                    'FORBIDDEN',
                    'You do not have permission to view this job.'
                ));
        }

        return res.status(200).json(success(job));

    } catch (err) {
        return res
            .status(500)
            .json(error('INTERNAL_ERROR', err.message));
    }
};

const createJob = async (req, res) => {
    try {
        const userId = req.userId;
        const io = req.app.get("io"); // Socket.IO reference instance

        const {
            featureSetId,
            modelTypeId,
            pearsonEnabled,
            pearsonThreshold,
            varianceEnabled,
            varianceThreshold
        } = req.body;
        
        // check for required fields
        if (!featureSetId || !modelTypeId) {
            return res.status(400).json(error('VALIDATION_ERROR', 'Missing required fields: featureSetId and modelTypeId are mandatory.'));
        }

        if (pearsonEnabled) {
            const parsedPearson = parseFloat(pearsonThreshold);
            if (pearsonThreshold === undefined || pearsonThreshold === null || pearsonThreshold === "" || isNaN(parsedPearson)) {
                return res.status(400).json(error('VALIDATION_ERROR', 'A valid numerical Pearson threshold must be provided when Pearson filter is enabled.'));
            }
        }

        if (varianceEnabled) {
            const parsedVariance = parseFloat(varianceThreshold);
            if (varianceThreshold === undefined || varianceThreshold === null || varianceThreshold === "" || isNaN(parsedVariance)) {
                return res.status(400).json(error('VALIDATION_ERROR', 'A valid numerical Variance threshold must be provided when Variance filter is enabled.'));
            }
        }

        // Persist the initial queued job row securely to MySQL
        const job = await Job.create({
            userId,
            featureSetId: parseInt(featureSetId),
            modelTypeId: parseInt(modelTypeId),
            featureSetName: FEATURE_SET_MAP[featureSetId] || "custom",
            modelName: MODEL_MAP[modelTypeId] || "Unknown",
            status: "queued"
        });

        const bridgeFiltersToCreate = [];
        if (!!pearsonEnabled && pearsonThreshold !== undefined && pearsonThreshold !== null) {
            bridgeFiltersToCreate.push({
                jobId: job.jobId,
                filterId: 1, // Primary key identifier for Pearson Correlation in FeatureFilter lookup
                thresholdValue: parseFloat(pearsonThreshold)
            });
        }
        if (!!varianceEnabled && varianceThreshold !== undefined && varianceThreshold !== null) {
            bridgeFiltersToCreate.push({
                jobId: job.jobId,
                filterId: 2, // Primary key identifier for Variance Threshold in FeatureFilter lookup
                thresholdValue: parseFloat(varianceThreshold)
            });
        }

        if (bridgeFiltersToCreate.length > 0) {
            await JobFilter.bulkCreate(bridgeFiltersToCreate);
        }

        // Broadcast initial queue registration status event
        io.emit("job_created", job.toJSON());

        // Update row status internally to 'running'
        await job.update({ status: "running", updateDate: new Date() });
        io.emit("job_status_changed", { jobId: job.jobId, status: "running" });

        // Fire and forget: send asynchronous transaction payload to microRNA training backend
        axios.post(`${FASTAPI_URL}/train`, {
            jobId: job.jobId,
            feature_set: job.featureSetName,
            model: job.modelName,
            variance_enabled: !!varianceEnabled,
            variance_threshold: varianceThreshold !== undefined ? parseFloat(varianceThreshold) : 0.01,
            pearson_enabled: !!pearsonEnabled,
            pearson_threshold: pearsonThreshold !== undefined ? parseFloat(pearsonThreshold) : 0.9
        })
        .then(async (response) => {
            const metrics = response.data.metrics || {};

            // Update parameters using precise data calculations from ML engine response
            await job.update({
                status: "completed",
                accuracy: metrics.accuracy ? parseFloat(Number(metrics.accuracy).toFixed(2)) : null,
                precision: metrics.precision ? parseFloat(Number(metrics.precision).toFixed(2)) : null,
                recall: metrics.recall ? parseFloat(Number(metrics.recall).toFixed(2)) : null,
                f1Score: metrics.f1Score ? parseFloat(Number(metrics.f1Score).toFixed(2)) : null,
                cv_mean: metrics.cv_mean ? parseFloat(Number(metrics.cv_mean).toFixed(2)) : null,
                cv_std: metrics.cv_std ? parseFloat(Number(metrics.cv_std).toFixed(2)) : null,
                featureCount: response.data.featureCount ?? null,
                updateDate: new Date()
            });

            // Stream confirmation updates instantly to all logged-in client screens
            io.emit("job_status_changed", { jobId: job.jobId, status: "completed" });
            io.emit("job_completed", job.toJSON());
        })
        .catch(async (err) => {
            const errorMsg = err.response?.data?.detail?.message || err.message || "ML service failed";
            const errorTrace = err.response?.data?.detail?.trace || null;

            await job.update({
                status: "failed",
                error: errorMsg,
                errorTrace: errorTrace,
                updateDate: new Date()
            });

            // Stream failures down real-time event pipeline to update dashboard cards
            io.emit("job_status_changed", { jobId: job.jobId, status: "failed" });
            io.emit("job_failed", { jobId: job.jobId, error: errorMsg });
        });

        // Immediately respond 201 Created to the client while training processes in the background
        return res.status(201).json(
            success({
                message: "Job created successfully and processing in background.",
                jobId: job.jobId,
                status: "queued"
            })
        );

    } catch (err) {
        return res.status(500).json(error("INTERNAL_ERROR", "Failed to compile execution job sequence: " + err.message));
    }
};

// 4. UPDATE JOB BY ID
const updateJobById = async (req, res) => {
    try {
        const jobId = parseInt(req.params.id);
        const job = await Job.findByPk(jobId);

        if (!job) {
            return res.status(404).json(error('NOT_FOUND', 'Job record not found'));
        }

        if (isNaN(jobId)) {
            return res.status(400).json(error('VALIDATION_ERROR', 'Invalid job ID'));
        }

        const { status, accuracy, precision, recall, f1Score, cv_mean, cv_std } = req.body;
        const updateFields = {};

        if (status !== undefined) updateFields.status = status;
        if (accuracy !== undefined) updateFields.accuracy = accuracy;
        if (precision !== undefined) updateFields.precision = precision;
        if (recall !== undefined) updateFields.recall = recall;
        if (f1Score !== undefined) updateFields.f1Score = f1Score;
        if (cv_mean !== undefined) updateFields.cv_mean = cv_mean;
        if (cv_std !== undefined) updateFields.cv_std = cv_std;

        updateFields.updateDate = new Date();

        await job.update(updateFields);
        return res.status(200).json(success(job));
    } catch (err) {
        return res.status(500).json(error('INTERNAL_ERROR', err.message));
    }
};

// 5. DELETE JOB BY ID (Restricted view access layer managed by admin roles in routes)
const deleteJobById = async (req, res) => {
    try {
        const jobId = parseInt(req.params.id);
        
        if (isNaN(jobId)) {
            return res.status(400).json(error('VALIDATION_ERROR', 'Invalid job ID'));
        }

        // Cascading deletion check: Clean out its bridge entries first before removing parent Job item
        await JobFilter.destroy({ where: { jobId: jobId } });
        
        const deletedCount = await Job.destroy({ where: { jobId: jobId } });

        if (!deletedCount) {
            return res.status(404).json(error('NOT_FOUND', 'Job record not found'));
        }

        return res.status(200).json(success({ message: 'Job record cleared successfully from database.', jobId }));
    } catch (err) {
        return res.status(500).json(error('INTERNAL_ERROR', err.message));
    }
};

module.exports = {
    getAllJobs,
    getJobById,
    createJob,
    updateJobById,
    deleteJobById
};