const { error } = require('../utils/responseHelpers');

const attachUserContext = (req, res, next) => {
    const userRole = req.header('x-user-role');
    const userId = req.header('x-user-id');

    if (userRole) {
        req.userRole = userRole;
    }

    if (userId) {
        req.userId = parseInt(userId);
    }

    next();
};

const authorizeRoles = (allowedRoles = []) => {
    if (!Array.isArray(allowedRoles)) {
        allowedRoles = [allowedRoles];
    }

    return (req, res, next) => {
        const userRole = req.userRole || req.header('x-user-role');

        if (!userRole) {
            return res.status(403).json(
                error('FORBIDDEN', 'Missing user role header.')
            );
        }

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json(
                error('FORBIDDEN', 'You do not have permission to perform this action.')
            );
        }

        next();
    };
};

// ensures a user is "logged in" by presence of `x-user-id` header.
const isAuthenticated = (req, res, next) => {
    const userId = req.userId || req.header('x-user-id');
    if (!userId) {
        return res.status(401).json(
            error('UNAUTHENTICATED', 'Authentication required')
        );
    }

    req.userId = parseInt(userId);
    next();
};

authorizeRoles.attachUserContext = attachUserContext;
authorizeRoles.isAuthenticated = isAuthenticated;

module.exports = authorizeRoles;