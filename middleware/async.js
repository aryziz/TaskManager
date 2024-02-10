const asyncWrapper = (func) => {
    return async (req, res, next) => {
        try {
            await func(req, res, next);
        } catch (error) {
            // Next middleware
            next(error);
        }
    }
}

module.exports = asyncWrapper;