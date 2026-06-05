const { success, error } = require('../utils/responseHelpers');
const users = require('../models/users.json');

const validThemes = ['light', 'dark', 'pink', 'teal'];

const buildSettingsPayload = (user) => ({
    username: user.username?.trim() || user.firstName || '',
    email: user.email || '',
    theme: validThemes.includes(user.theme) ? user.theme : 'light'
});

const getSettings = (req, res) => {
    const userId = req.userId;
    const user = users.find((u) => u.userId === userId);

    if (!user) {
        return res.status(404).json(error('NOT_FOUND', 'User not found'));
    }

    res.status(200).json(success(buildSettingsPayload(user)));
};

const updateSettings = (req, res) => {
    const userId = req.userId;
    const user = users.find((u) => u.userId === userId);

    if (!user) {
        return res.status(404).json(error('NOT_FOUND', 'User not found'));
    }

    const { username, email, theme } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // doing the same checks on the backend to ensure data integrity and security, even if the frontend should have already validated the input
    
    if (!username?.trim() || !email?.trim() || !theme?.trim()) {
        return res.status(400).json(error('VALIDATION_ERROR', 'Username, email, and theme are required.'));
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json(error('VALIDATION_ERROR', 'Please provide a valid email address.'));
    }

    if (!validThemes.includes(theme)) {
        return res.status(400).json(error('VALIDATION_ERROR', 'Theme must be one of light, dark, pink, or teal.'));
    }

    user.firstName = username.trim();
    user.email = email.trim();
    user.theme = theme.trim();
    user.updateDate = new Date().toISOString();

    res.status(200).json(
        success({
            message: 'Settings updated successfully',
            settings: buildSettingsPayload(user)
        })
    );
};

module.exports = {
    getSettings,
    updateSettings
};
