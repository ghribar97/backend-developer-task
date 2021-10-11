const CommonError = require("./commonError").CommonError;

class ApiError extends CommonError {

    constructor(statusCode, message) {
        super(statusCode, `API error: ${message}`);
    }
}

class UnauthorizedApiError extends ApiError {

    constructor() {
        super(401, 'Unauthorized!');
    }
}

class InvalidCredentialsApiError extends ApiError {

    constructor() {
        super(401, 'Invalid username or password!');
    }
}

class NotFoundApiError extends ApiError {

    constructor(message) {
        super(404, message);
    }
}

class AlreadyExistsApiError extends ApiError {

    constructor(message) {
        super(403, message);
    }
}

module.exports = {
    ApiError,
    UnauthorizedApiError,
    NotFoundApiError,
    AlreadyExistsApiError,
    InvalidCredentialsApiError
};