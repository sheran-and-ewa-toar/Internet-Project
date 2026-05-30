const express = require('express');

const router = express.Router();

const authorizeRoles = require('../middleware/authMiddleware');
const { validateBody, validateParams } = require('../middleware/validationMiddleware');

const {
    getAllJobs,
    getJobById,
    createJob,
    updateJobById,
    deleteJobById
} = require('../controllers/jobsController');

router.get(
    '/',
    authorizeRoles.isAuthenticated,
    authorizeRoles(['user', 'manager', 'admin']),
    getAllJobs
);

router.get(
    '/:id',
    validateParams(['id']),
    authorizeRoles.isAuthenticated,
    authorizeRoles(['user', 'manager', 'admin']),
    getJobById
);

router.post(
    '/',
    authorizeRoles.isAuthenticated,
    validateBody(['featureSetId', 'modelTypeId']),
    createJob
);

router.put(
    '/:job_id',
    validateParams(['job_id']),
    authorizeRoles.isAuthenticated,
    authorizeRoles(['user','manager', 'admin']),
    validateBody(['title', 'notes']),
    updateJobById
);

router.delete(
    '/:job_id',
    validateParams(['job_id']),
    authorizeRoles.isAuthenticated,
    authorizeRoles(['admin']),
    deleteJobById
);

module.exports = router;
