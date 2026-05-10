const users = require('../models/users.json');

const getAllUsers = (req, res) => {

    res.status(200).json(users);
};

const getUserById = (req, res) => {

    const id = parseInt(req.params.id);

    const user = users.find(u => u.userId === id);

    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    res.status(200).json(user);
};

const createUser = (req, res) => {

    const { firstName, lastName, userRole } = req.body;

    // Validation
    if (!firstName || !lastName || !userRole) {
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

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

    res.status(201).json({
        message: 'User created successfully',
        userId: newUserId
    });
};

const updateUser = (req, res) => {

    const id = parseInt(req.params.id);

    const user = users.find(u => u.userId === id);

    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    const { firstName, lastName, userRole } = req.body;

    // Validation
    if (!firstName || !lastName || !userRole) {
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.userRole = userRole;
    user.updateDate = new Date().toISOString();

    res.status(200).json({
        message: 'User updated successfully',
        userId: id
    });
};

const deleteUser = (req, res) => {

    const id = parseInt(req.params.id);

    const userIndex = users.findIndex(u => u.userId === id);

    if (userIndex === -1) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    users.splice(userIndex, 1);

    res.status(200).json({
        message: 'User deleted successfully',
        userId: id
    });
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};