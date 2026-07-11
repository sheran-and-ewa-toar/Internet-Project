const { success, error } = require('../utils/responseHelpers');
const { User } = require('../models');

const getSettings = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, {
            attributes: ['email', 'theme']
        });

        if (!user) {
            return res.status(404).json(error('NOT_FOUND', 'User not found'));
        }

        return res.status(200).json(success(user)); //only mail and theme
    } catch (err) {
        return res.status(500).json(error('INTERNAL_ERROR', 'Failed to fetch settings'));
    }
};

const updateSettings = async (req, res) => {
    try {
        const { email, password, theme } = req.body;
        const updatePayload = {};
        const validThemes = ['light', 'dark', 'pink', 'teal'];
        const normalizedPassword = password === undefined ? undefined : String(password);

        if (email !== undefined) {
            const normalizedEmail = String(email).trim().toLowerCase();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(normalizedEmail)) {
                return res.status(400).json(error('VALIDATION_ERROR', 'Invalid email format'));
            }

            const duplicateUser = await User.findOne({ where: { email: normalizedEmail } });

            if (duplicateUser && duplicateUser.userId !== req.userId) {
                return res.status(409).json(error('USER_EXISTS', 'Email already registered'));
            }

            updatePayload.email = normalizedEmail;
        }

        if (normalizedPassword?.trim()) {
            if (normalizedPassword.length < 6) {
                return res.status(400).json(
                    error('VALIDATION_ERROR', 'Password must be at least 6 characters')
                );
            }

            
            updatePayload.password = normalizedPassword;
        }

        if (theme !== undefined) {
            if (!validThemes.includes(theme)) {
                return res.status(400).json(error('VALIDATION_ERROR', 'Invalid theme'));
            }

            updatePayload.theme = theme;
        }

        updatePayload.updateDate = new Date();

        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(404).json(error('NOT_FOUND', 'User not found'));
        }

        await user.update(updatePayload);

        const updatedUser = await User.findByPk(req.userId, {
            attributes: ['email', 'theme']
        });

        return res.status(200).json(success(updatedUser));
    } catch (err) {
        return res.status(500).json(error('INTERNAL_ERROR', 'Failed to update settings'));
    }
};

module.exports = {
    getSettings,
    updateSettings
};