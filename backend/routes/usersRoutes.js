const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
    validateBody,
    validateParams
} = require('../middleware/validationMiddleware');

const {
    getAllUsers,
    getCurrentUser,    
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/usersController');

router.get('/', getAllUsers);

router.get(
    '/me',
    authMiddleware.isAuthenticated,
    getCurrentUser
);

router.get('/:id', validateParams(['id']), getUserById);

router.post(
    '/',
    validateBody([
        'firstName',
        'lastName',
        'email',
        'password'
    ]),
    createUser
);

router.put(
    "/me",
    authMiddleware.isAuthenticated,
    updateUser
);

router.put(
    '/:id',
    validateParams(['id']),
    authMiddleware.isAuthenticated,
    authMiddleware.authorizeRoles(['admin', 'manager', 'user']),
    validateBody(["firstName", "lastName", "email", "theme"]),
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