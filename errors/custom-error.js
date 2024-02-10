class CustomAPIError extends Error {
    constructor(message, statusCode) {
        // Inherits message attr from parent Error class
        super(message);
        this.statusCode = statusCode
    }
}

const createCustomError = (msg, statusCode) => {
    return new CustomAPIError(msg, statusCode);
}

module.exports = { createCustomError, CustomAPIError };