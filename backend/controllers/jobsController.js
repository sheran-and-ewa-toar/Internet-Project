const { success, error } = require('../utils/responseHelpers');
const jobs = require('../models/jobs.json');
const axios = require("axios");

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

const fs = require("fs");
const path = require("path");

const JOBS_PATH = path.join(__dirname, "../models/jobs.json");

function saveJobs() {
    fs.writeFileSync(JOBS_PATH, JSON.stringify(jobs, null, 2));
}

const getAllJobs = (req, res) => {
    const role = req.userRole;
    const userId = req.userId;

    if (!role) {
        return res.status(403).json(
            error('FORBIDDEN', 'Missing user role header.')
        );
    }

    if (role === 'user') {
        const ownJobs = jobs.filter(
            job => job.userId === userId
        );

        return res.status(200).json(
            success(ownJobs)
        );
    }

    return res.status(200).json(
        success(jobs)
    );
};

const getJobById = (req, res) => {
    const id = parseInt(req.params.id);

    const job = jobs.find(
        j => j.jobId === id
    );

    if (!job) {
        return res.status(404).json(
            error('NOT_FOUND', 'Job not found')
        );
    }

    if (
        req.userRole === 'user' &&
        req.userId !== job.userId
    ) {
        return res.status(403).json(
            error(
                'FORBIDDEN',
                'You do not have permission to perform this action.'
            )
        );
    }

    return res.status(200).json(
        success(job)
    );
};

const createJob = async (req, res) => {
    try {
        const userId = req.userId;

        const {
            featureSetId,
            modelTypeId,
            pearsonEnabled,
            pearsonThreshold,
            varianceEnabled,
            varianceThreshold
        } = req.body;

        const newId = jobs.length > 0
            ? Math.max(...jobs.map(j => j.jobId)) + 1
            : 1;

        const job = {
            jobId: newId,
            userId,
            featureSetId,
            modelTypeId,

            featureSetName: FEATURE_SET_MAP[featureSetId],
            modelName: MODEL_MAP[modelTypeId],

            pearsonEnabled: !!pearsonEnabled,
            pearsonThreshold: pearsonThreshold ?? null,

            varianceEnabled: !!varianceEnabled,
            varianceThreshold: varianceThreshold ?? null,

            status: "queued",
            createDate: new Date().toISOString()
        };

        jobs.push(job);

        job.status = "running";

        axios.post("http://localhost:8000/train", {
            jobId: job.jobId,
            feature_set: job.featureSetName,
            model: job.modelName,
            variance_enabled: job.varianceEnabled,
            variance_threshold: job.varianceThreshold,
            pearson_enabled: job.pearsonEnabled,
            pearson_threshold: job.pearsonThreshold
        })
        .then((response) => {
            const metrics = response.data.metrics || {};

            job.status = "completed";

            job.accuracy = Number(metrics.accuracy).toFixed(2) ?? null;
            job.precision = Number(metrics.precision).toFixed(2) ?? null;
            job.recall = Number(metrics.recall).toFixed(2) ?? null;
            job.f1Score = Number(metrics.f1Score).toFixed(2) ?? null;
            job.cv_mean = Number(metrics.cv_mean).toFixed(2) ?? null;
            job.cv_std = Number(metrics.cv_std).toFixed(2) ?? null;

            job.featureCount = response.data.featureCount ?? null;
            saveJobs();
        })
        .catch((err) => {
            job.status = "failed";
            saveJobs();
            job.error =
                err.response?.data?.detail?.message ||
                err.message ||
                "ML service failed";

            job.errorTrace =
                err.response?.data?.detail?.trace || null;
        });

        return res.status(201).json(
            success({
                message: "Job created",
                jobId: job.jobId,
                status: job.status
            })
        );

    } catch (err) {
        return res.status(500).json(
            error("INTERNAL_ERROR", "Failed to create job")
        );
    }
};

const updateJobById = (req, res) => {

    const jobId = parseInt(
        req.params.job_id
    );

    const job = jobs.find(
        j => j.jobId === jobId
    );

    if (!job) {
        return res.status(404).json(
            error('NOT_FOUND', 'Job not found')
        );
    }

    const {
        status,
        accuracy,
        precision,
        recall,
        f1Score,
        cv_mean,
        cv_std
    } = req.body;

    if (status !== undefined) {
        job.status = status;
    }

    if (accuracy !== undefined) {
        job.accuracy = accuracy;
    }

    if (precision !== undefined) {
        job.precision = precision;
    }

    if (recall !== undefined) {
        job.recall = recall;
    }

    if (f1Score !== undefined) {
        job.f1Score = f1Score;
    }

    if (cv_mean !== undefined) {
        job.cv_mean = cv_mean;
    }

    if (cv_std !== undefined) {
        job.cv_std = cv_std;
    }

    job.updateDate =
        new Date().toISOString();

    return res.status(200).json(
        success(job)
    );
};

const deleteJobById = (req, res) => {

    const jobId = parseInt(
        req.params.job_id
    );

    const jobIndex = jobs.findIndex(
        j => j.jobId === jobId
    );

    if (jobIndex === -1) {
        return res.status(404).json(
            error('NOT_FOUND', 'Job not found')
        );
    }

    jobs.splice(jobIndex, 1);

    return res.status(200).json(
        success({
            message: 'Job deleted successfully',
            jobId
        })
    );
};

module.exports = {
    getAllJobs,
    getJobById,
    createJob,
    updateJobById,
    deleteJobById
};