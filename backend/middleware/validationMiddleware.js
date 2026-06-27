const isEmptyValue = (value) => {
    return value === undefined || value === null || value === '';
};

const validationError = (message, details = {}) => {
    return {
        success: false,
        data: null,
        error: {
            code: 'VALIDATION_ERROR',
            message,
            details
        }
    };
};


const validateBody = (requiredFields = []) => {
    return (req, res, next) => {
        const missingFields = requiredFields.filter((field) => {
            return isEmptyValue(req.body?.[field]);
        });

        if (missingFields.length > 0) {
            return res.status(400).json(
                validationError('Missing required request body fields.', {
                    missingFields
                })
            );
        }

        next();
    };
};

const validateParams = (requiredParams = []) => {
    return (req, res, next) => {
        const invalidParams = requiredParams.filter((param) => {
            const value = req.params?.[param];
            return isEmptyValue(value) || Number.isNaN(Number(value));
        });

        if (invalidParams.length > 0) {
            return res.status(400).json(
                validationError('Invalid or missing route parameters.', {
                    invalidParams
                })
            );
        }

        next();
    };
};

module.exports = {
    validateBody,
    validateParams
};
