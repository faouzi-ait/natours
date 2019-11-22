const devError = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
            err
        });
    }
};

const prodError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        devError(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        prodError(err, res);
    }
};
