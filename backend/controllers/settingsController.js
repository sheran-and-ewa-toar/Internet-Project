const users = require('../models/users.json');
const { success, error } = require('../utils/responseHelpers');

const getSettings = (req, res) => {
    const userId = req.userId;

    const user = users.find(u => u.userId === userId);

    if (!user) {
        return res.status(404).json(error('NOT_FOUND', 'User not found'));
    }

    return res.status(200).json(success({
        email: user.email,
        theme: user.theme ?? 'light'
    }));
};

const updateUser = require('./usersController').updateUser;

const updateSettings = (req, res) => {
    req.body = {
        email: req.body.email,
        password: req.body.password,
        theme: req.body.theme
    };

    return updateUser(req, res);
};

module.exports = {
    getSettings,
    updateSettings
};