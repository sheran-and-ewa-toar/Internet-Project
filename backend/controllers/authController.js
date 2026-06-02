const users = require('../models/users.json');
const { success, error } = require('../utils/responseHelpers');

const login = (req, res) => {

    const { email, password } = req.body;

    const user = users.find(
        u => u.email === email &&
             u.password === password
    );

    if (!user) {
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