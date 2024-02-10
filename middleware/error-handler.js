const { CustomAPIError } = require('../errors/custom-error');

// Next calls will call this error handler
const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({ msg: err.message });
    }
    return res.status(500).json({ msg: `Something went wrong. Try again later.` });
}

module.exports = errorHandlerMiddleware;