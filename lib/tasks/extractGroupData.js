var _ = require('underscore');
var uuid = require('uuid');
var HttpError = require('../HttpError');

module.exports = function(context, req, next) {

    if (!_.isObject(req.body)) return next(HttpError.badRequest('Missing body'));
    if (!req.body.name) return next(HttpError.badRequest('A name is required'));
    if (!req.body.theme) return next(HttpError.badRequest('A theme is required'));

    context.data = _.chain(req.body).clone().extend({ resourceId: uuid.v1() }).value();

    next();
}