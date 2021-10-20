const isCelebrate = require('celebrate').isCelebrateError;
const { CommonError } = require('./commonError');

exports.celebrateErrorHandling = (err, req, res, next) => {
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
        return res.status(400).send({
            message: errorString
        });
    }
    
    return next(err);
};

exports.commonErrorHandling = (err, req, res, next) => {
    if (err instanceof CommonError) {
        return res.status(err.statusCode).json({
            message: err.message
        });
    }
    
    return next(err);
};

exports.fatalErrorHandling = (err, req, res, next) => {
    return res.status(500).json({
        message: err.message
    });
};
