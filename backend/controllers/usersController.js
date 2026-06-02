const { success, error } = require('../utils/responseHelpers');
const users = require('../models/users.json');

const getAllUsers = (req, res) => {
    res.status(200).json(success(users));
};

const getUserById = (req, res) => {

    const id = parseInt(req.params.id);

    const user = users.find((u) => u.userId === id);

    if (!user) {
        return res.status(404).json(error('NOT_FOUND', 'User not found'));
    }

    res.status(200).json(success(user));
};

const getCurrentUser = (req, res) => {

    const userId = req.userId;

    const user = users.find(
        u => u.userId === userId
    );

    if (!user) {
        return res.status(404).json(
            error('NOT_FOUND', 'User not found')
        );
    }

    res.status(200).json(
        success(user)
    );
};

const createUser = (req, res) => {

    const { firstName, lastName, userRole } = req.body;

    // Generate new ID
    const newUserId =
        users.length > 0
            ? Math.max(...users.map(u => u.userId)) + 1
            : 1;

    const newUser = {
        userId: newUserId,
        firstName,
        lastName,
        userRole,
        createDate: new Date().toISOString(),
        updateDate: new Date().toISOString()
    };

    users.push(newUser);

    res.status(201).json(
        success({
            message: 'User created successfully',
            userId: newUserId
        })
    );
};

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find((u) => u.userId === id);

    if (!user) {
        return res.status(404).json(error('NOT_FOUND', 'User not found'));
    }

    const requesterRole = req.userRole;
    const requesterId = req.userId;

    if (!requesterRole || !requesterId) {
        return res.status(401).json(error('UNAUTHENTICATED', 'Authentication required'));
    }

    if (requesterRole === 'user') {
        if (requesterId !== id) {
            return res.status(403).json(
                error('FORBIDDEN', 'You do not have permission to perform this action.')
            );
        }

        if (req.body.userRole && req.body.userRole !== user.userRole) {
            return res.status(403).json(
                error('FORBIDDEN', 'You do not have permission to perform this action.')
            );
        }
    }

    const { firstName, lastName, userRole } = req.body;

    user.firstName = firstName;
    user.lastName = lastName;

    if (requesterRole === 'admin' || requesterRole === 'manager') {
        if (userRole) {
            user.userRole = userRole;
        }
    }

    user.updateDate = new Date().toISOString();

    res.status(200).json(
        success({
            message: 'User updated successfully',
            userId: id
        })
    );
};

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

    const userIndex = users.findIndex((u) => u.userId === id);

    if (userIndex === -1) {
        return res.status(404).json(error('NOT_FOUND', 'User not found'));
    }

    users.splice(userIndex, 1);

    res.status(200).json(
        success({
            message: 'User deleted successfully',
            userId: id
        })
    );
};

module.exports = {
    getAllUsers,
    getUserById,
    getCurrentUser,
    createUser,
    updateUser,
    deleteUser
};