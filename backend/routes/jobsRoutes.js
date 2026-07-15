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

const verifyJobUpdateAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (apiKey && apiKey === process.env.INTERNAL_API_SECRET) {
        return next();
    }
    
    return authMiddleware.isAuthenticated(req, res, () => {
        authMiddleware.authorizeRoles(['admin', 'manager', 'user'])(req, res, next);
    });
};

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

router.put('/:id', verifyJobUpdateAuth, updateJobById);

router.delete(
    '/:id',
    validateParams(['id']),
    authMiddleware.isAuthenticated,
    authMiddleware.authorizeRoles([
        'user',
        'manager',
        'admin'
    ]),
    deleteJobById
);

module.exports = router;