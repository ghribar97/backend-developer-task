const isCelebrate = require('celebrate').isCelebrateError;
const { CommonError } = require('./commonError');

function celebrateErrorHandling(err, req, res, next) {
    if (isCelebrate(err)) {
        var errorString = "";
        if (err.details.get("body")) {
            const errorBody = err.details.get('body');
            const { details } = errorBody;
            errorString = details[0].message;
        }
        else if(err.details.get("params")) {
            const errorBody = err.details.get("params");
            const { details } = errorBody;
            errorString = details[0].message;
        }
        return res.send({
            statusCode: 400,
            message: errorString
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