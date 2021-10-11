const isCelebrate = require('celebrate').isCelebrateError;
const { CommonError } = require('./commonError');

function celebrateErrorHandling(err, req, res, next) {
    if (isCelebrate(err)) {
        return res.send({
            statusCode: 400,
            message: err.joi.message
        });
    }
    
    return next(err);
}

function commonErrorHandling(err, req, res, next) {
    if (err instanceof CommonError) {
        return res.send({
            statusCode: err.statusCode,
            message: err.message
        });
    }
    
    return next(err);
}



module.exports = {
    celebrateErrorHandling,
    commonErrorHandling
}