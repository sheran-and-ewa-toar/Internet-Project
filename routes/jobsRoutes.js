const express = require('express');

const router = express.Router();

const authorizeRoles = require('../middleware/authMiddleware');

const {
    getAllJobs,
    getJobById,
    createJob
} = require('../controllers/jobsController');

router.get('/', getAllJobs);

router.get('/:id', getJobById);

router.post('/', authorizeRoles.isAuthenticated, createJob);

module.exports = router;
