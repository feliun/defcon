var expose = require('../utils').expose;

module.exports = function(context, collection, next) {
    context.response = expose(collection.name(), context[collection.name()]);
    next();
}
