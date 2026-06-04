const { success, error } = require('../utils/responseHelpers');
const jobs = require('../models/jobs.json');

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

const createJob = (req, res) => {

    const userId = req.userId;

    const {
        featureSetId,
        modelTypeId,

        pearsonEnabled = false,
        pearsonThreshold = null,

        varianceEnabled = false,
        varianceThreshold = null
    } = req.body;

    const newId =
        jobs.length > 0
            ? Math.max(...jobs.map(j => j.jobId)) + 1
            : 1;

    const newJob = {
        jobId: newId,

        userId,

        featureSetId,
        modelTypeId,

        pearsonEnabled,
        pearsonThreshold,

        varianceEnabled,
        varianceThreshold,

        status: 'pending',

        accuracy: null,
        precision: null,
        recall: null,
        f1Score: null,
        cv_mean: null,
        cv_std: null,

        createDate: new Date().toISOString()
    };

    jobs.push(newJob);

    return res.status(201).json(
        success({
            message: 'Job created',
            jobId: newId
        })
    );
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