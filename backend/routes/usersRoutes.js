const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
    validateBody,
    validateParams
} = require('../middleware/validationMiddleware');

const {
    getAllUsers,
    getUserById,
    getCurrentUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/usersController');

router.get('/', getAllUsers);

router.get('/:id', validateParams(['id']), getUserById);

router.get(
    '/me',
    authMiddleware.isAuthenticated,
    getCurrentUser
);

router.post('/', validateBody(['firstName', 'lastName', 'userRole']), createUser);

router.put(
    '/:id',
    validateParams(['id']),
    authMiddleware.isAuthenticated,
    authMiddleware.authorizeRoles(['admin', 'manager', 'user']),
    validateBody(['firstName', 'lastName']),
    updateUser
);

router.delete(
    '/:id',
    validateParams(['id']),
    authMiddleware.isAuthenticated,
    authMiddleware.authorizeRoles(['admin']),
    deleteUser
);

module.exports = router;