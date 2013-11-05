module.exports = function(context, collection, next) {
    collection.create(context.data, function(err, document) {
        context[collection.name()] = document;
        next(err);
    })
}
