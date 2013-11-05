var HttpError = require('../HttpError');

module.exports = function(context, req, next) {
    if (!req.params.resourceId) return next(HttpError.badRequest('A resourceId is required'));
    context.resourceId = req.params.resourceId;
    next();
}
