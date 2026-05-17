const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.header('x-user-role');
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                data: null,
                error: {
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to perform this action',
                    details: {}
                }
            });
        }
        next();
    };
};

// Lightweight authentication check: ensures a user is "logged in" by presence of `x-user-id` header.
const isAuthenticated = (req, res, next) => {
    const userId = req.header('x-user-id');
    if (!userId) {
        return res.status(401).json({
            success: false,
            data: null,
            error: {
                code: 'UNAUTHENTICATED',
                message: 'Authentication required',
                details: {}
            }
        });
    }
    // attach parsed userId for downstream handlers
    req.userId = parseInt(userId);
    next();
};

// Export authorizeRoles as the default function, and attach isAuthenticated for compatibility.
authorizeRoles.isAuthenticated = isAuthenticated;

module.exports = authorizeRoles;