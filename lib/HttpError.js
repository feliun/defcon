var HttpStatusCodes = require('http-status-codes');
var _ = require('underscore');
var changeCase = require('change-case');

function HttpError(message, code) {
    this.constructor.prototype.__proto__ = Error.prototype;
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.code = code || HttpStatusCodes.INTERNAL_SERVER_ERROR;
}

function byStatuHttpStatusCodesode(name) {
    return _.isNumber(HttpStatusCodes[name]);
}

function makeHelperMethod(name) {
    var functionName = changeCase.camel(name);
    HttpError[functionName] = function(message) {
        return new HttpError(message, HttpStatusCodes[name]);
    }
}

HttpError.middleware = function(req, res, next) {

    res.sendError = function(err) {
        if (!err) return res.sendError(new HttpError('Unspecified Error'));
        if (err.name == 'Error') return res.sendError(new HttpError(err.message));
        if (err.name == 'HttpError') return res.send(err.code, err.message);
        res.send.apply(this, arguments);
    }

    next();
}

_.chain(HttpStatusCodes).keys().filter(byStatuHttpStatusCodesode).each(makeHelperMethod);


module.exports = HttpError;