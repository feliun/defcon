module.exports = function(context, collection, next) {
    collection.get({ resourceId: context.resourceId }, function(err, document) {
        if (err) return next(HttpError.internalServerError(err.message));
        if (!document) return next(HttpError.notFound('The ' + collection.name() + ' does not exist'));
        context[collection.name()] = document;
        next();
    })
};