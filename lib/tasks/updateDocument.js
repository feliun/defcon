module.exports = function(context, collection, next) {
    collection.update(context.data, function(err, document) {
        context[collection.name()] = document;
        next(err);
    })
}