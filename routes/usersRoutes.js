const express = require('express');

const router = express.Router();

const authorizeRoles = require('../middleware/authMiddleware');

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/usersController');

router.get('/', getAllUsers);

router.get('/:id', getUserById);

router.post('/', createUser);

router.put('/:id', updateUser);

router.delete(
    '/:id',
    authorizeRoles('admin'),
    deleteUser
);

module.exports = router;