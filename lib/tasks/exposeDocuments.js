var _ = require('underscore');
var expose = require('../utils').expose;

module.exports = function(context, collection, next) {
    context.response = _.map(context[collection.name()], function(document) {
        return expose(collection.name(), document);
    });
    next();
}