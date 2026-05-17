const jobs = require('../models/jobs.json');

const getAllJobs = (req, res) => {
    res.status(200).json(jobs);
};

const getJobById = (req, res) => {
    const id = parseInt(req.params.id);
    const job = jobs.find(j => j.jobId === id);
    if (!job) {
        return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
};

const createJob = (req, res) => {
    
    const userId = req.userId || req.body.userId;

    const { featureSetId, modelTypeId, filterId } = req.body;

    if (!featureSetId || !modelTypeId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const newId = jobs.length > 0 ? Math.max(...jobs.map(j => j.jobId)) + 1 : 1;

    const newJob = {
        jobId: newId,
        userId,
        featureSetId,
        modelTypeId,
        filterId: filterId || null,
        createDate: new Date().toISOString()
    };

    jobs.push(newJob);

    res.status(201).json({ message: 'Job created', jobId: newId });
};

module.exports = {
    getAllJobs,
    getJobById,
    createJob
};
