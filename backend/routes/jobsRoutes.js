const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
    validateParams
} = require('../middleware/validationMiddleware');

const {
    getAllJobs,
    getJobById,
    createJob,
    updateJobById,
    deleteJobById
} = require('../controllers/jobsController');

router.get(
    '/',
    authMiddleware.isAuthenticated,
    authMiddleware.authorizeRoles([
        'user',
        'manager',
        'admin'
    ]),
    getAllJobs
);

router.get(
    '/:id',
    validateParams(['id']),
    authMiddleware.isAuthenticated,
    authMiddleware.authorizeRoles([
        'user',
        'manager',
        'admin'
    ]),
    getJobById
);

router.post(
    '/',
    authMiddleware.isAuthenticated,
    authMiddleware.authorizeRoles([
        'user',
        'manager',
        'admin'
    ]),
    createJob
);

router.put(
    '/:job_id',
    validateParams(['job_id']),
    authMiddleware.isAuthenticated,
    authMiddleware.authorizeRoles([
        'manager',
        'admin'
    ]),
    updateJobById
);

router.delete(
    '/:job_id',
    validateParams(['job_id']),
    authMiddleware.isAuthenticated,
    authMiddleware.authorizeRoles([
        'admin'
    ]),
    deleteJobById
);

module.exports = router;