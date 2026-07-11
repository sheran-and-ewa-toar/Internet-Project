const success = (data) => ({
    success: true,
    data,
    error: null
});

const successWithFile = (res, content, filename, statusCode = 200) => {
    return res.status(statusCode).json(success({ 
        csvData: content, 
        fileName: filename 
    }));
};

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
    successWithFile,
    error
};
