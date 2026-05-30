const express = require('express');

const router = express.Router();

const authorizeRoles = require('../middleware/authMiddleware');
const {
    validateBody,
    validateParams
} = require('../middleware/validationMiddleware');

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/usersController');

router.get('/', getAllUsers);

router.get('/:id', validateParams(['id']), getUserById);

router.post('/', validateBody(['firstName', 'lastName', 'userRole']), createUser);

router.put(
    '/:id',
    validateParams(['id']),
    authorizeRoles.isAuthenticated,
    authorizeRoles(['admin', 'manager', 'user']),
    validateBody(['firstName', 'lastName']),
    updateUser
);

router.delete(
    '/:id',
    validateParams(['id']),
    authorizeRoles.isAuthenticated,
    authorizeRoles(['admin']),
    deleteUser
);

module.exports = router;