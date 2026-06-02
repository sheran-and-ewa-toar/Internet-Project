const success = (data) => ({
    success: true,
    data,
    error: null
});

const error = (code, message, details = {}) => ({
    success: false,
    data: null,
    error: {
        code,
        message,
        details
    }
});

module.exports = {
    success,
    error
};
