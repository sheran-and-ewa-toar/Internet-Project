const loggerMiddleware = (req, res, next) => {

    const startTime = Date.now();

    res.on('finish', () => {

        const endTime = Date.now();

        const duration = endTime - startTime;

        console.log(
            `[${new Date().toISOString()}] ` +
            `${req.method} ` +
            `${req.originalUrl} ` +
            `Status: ${res.statusCode} ` +
            `Duration: ${duration}ms`
        );
    });

    next();
};

module.exports = loggerMiddleware;