module.exports = function(context, collection, next) {
    collection.list(context.criteria, function(err, documents) {
        context[collection.name()] = documents;
        next(err);
    })
}
