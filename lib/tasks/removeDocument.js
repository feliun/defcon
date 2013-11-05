var HttpError = require('../HttpError');

module.exports = function(context, collection, next) {
    collection.remove(context.resourceId, function(err, document) {
        if (err) return next(HttpError.internalServerError(err.message));
        if (!document) return next(HttpError.notFound('The ' + collection.name() + ' does not exist'));
        context[collection.name()] = document;
        next();
    })
}