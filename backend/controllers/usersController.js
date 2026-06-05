const { success, error } = require('../utils/responseHelpers');
const users = require('../models/users.json');

const fs = require("fs");
const path = require("path");

const usersFile = path.join(
    __dirname,
    "../models/users.json"
);

const getAllUsers = (req, res) => {
    res.status(200).json(success(users));
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

const getUserById = (req, res) => {

    const id = parseInt(req.params.id);

    const user = users.find((u) => u.userId === id);

    if (!user) {
        return res.status(404).json(error('NOT_FOUND', 'User not found'));
    }

    res.status(200).json(success(user));
};

const createUser = (req, res) => {

    const {
        firstName,
        lastName,
        email,
        password
    } = req.body;

    const existingUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
        return res.status(409).json(
            error(
                "USER_EXISTS",
                "Email already registered"
            )
        );
    }

    const newUserId =
        users.length > 0
            ? Math.max(...users.map(u => u.userId)) + 1
            : 1;

    const newUser = {
        userId: newUserId,
        firstName,
        lastName,
        email,
        password,
        userRole: "user",
        createDate: new Date().toISOString(),
        updateDate: new Date().toISOString(),
        theme: "light"
    };

    users.push(newUser);

    fs.writeFileSync(
        usersFile,
        JSON.stringify(users, null, 2)
    );

    return res.status(201).json(
        success({
            message: "User created successfully",
            userId: newUserId
        })
    );
};

const updateUser = (req, res) => {
    const id = req.userId;
    const user = users.find((u) => u.userId === id);

    if (!user) {
        return res.status(404).json(error('NOT_FOUND', 'User not found'));
    }

    const requesterRole = req.userRole;
    const requesterId = req.userId;

    if (!requesterRole || !requesterId) {
        return res.status(401).json(error('UNAUTHENTICATED', 'Authentication required'));
    }

    const isSelf = requesterId === id;
    const isAdmin = requesterRole === 'admin';
    const isManager = requesterRole === 'manager';

    if (!isSelf && !isAdmin && !isManager) {
        return res.status(403).json(
            error('FORBIDDEN', 'You do not have permission to perform this action.')
        );
    }

    const {
        firstName,
        lastName,
        email,
        password,
        userRole,
        theme
    } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validThemes = ['light', 'dark', 'pink', 'teal'];

    if (email !== undefined && !emailRegex.test(email)) {
        return res.status(400).json(
            error('VALIDATION_ERROR', 'Invalid email format')
        );
    }

    if (password !== undefined && password.length > 0 && password.length < 6) {
        return res.status(400).json(
            error('VALIDATION_ERROR', 'Password must be at least 6 characters')
        );
    }

    if (theme !== undefined && !validThemes.includes(theme)) {
        return res.status(400).json(
            error('VALIDATION_ERROR', 'Invalid theme')
        );
    }

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (email !== undefined) user.email = email;

    if (password?.trim()) {
        user.password = password;
    }

    if ((isAdmin || isManager) && userRole !== undefined) {
        user.userRole = userRole;
    }

    if (theme !== undefined) {
        user.theme = theme;
    }

    user.updateDate = new Date().toISOString();

    fs.writeFileSync(
        usersFile,
        JSON.stringify(users, null, 2)
    );

    return res.status(200).json(
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
    getCurrentUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};