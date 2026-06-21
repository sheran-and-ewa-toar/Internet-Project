const { success, error } = require('../utils/responseHelpers');
const { User } = require('../models');
const { verifyPassword } = require('../utils/passwordHelpers');

const login = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            where: { email: String(email || '').trim() }
        });
        
        if (!user || !verifyPassword(password, user.password)) {
            return res.status(401).json(
                error(
                    'INVALID_CREDENTIALS',
                    'Invalid email or password.'
                )
            );
        }

        return res.status(200).json(
            success({
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                userRole: user.userRole
            })
        );
    } catch (err) {
        return res.status(500).json(error('INTERNAL_ERROR', 'Failed to log in'));
    }
};

const logout = (req, res) => {

    return res.status(200).json(
        success({
            message: 'Logged out successfully'
        })
    );
};

module.exports = {
    login,
    logout
};