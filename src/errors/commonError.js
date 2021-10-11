class CommonError extends Error {

    constructor (statusCode, message) {

        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        
        // capturing the stack trace keeps the reference to your error class
        Error.captureStackTrace(this, this.constructor);
    }

}

module.exports = {
    CommonError
};