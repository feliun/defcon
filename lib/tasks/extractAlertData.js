var _ = require('underscore');
var uuid = require('uuid');
var HttpError = require('../HttpError');

module.exports = function(context, req, next) {

    if (!_.isObject(req.body)) return next(HttpError.badRequest('Missing body'));
    if (!req.body.system) return next(HttpError.badRequest('A system is required'));
    if (!req.body.type) return next(HttpError.badRequest('A type is required'));

    context.data = _.chain(req.body).clone().extend({
        resourceId: uuid.v1()
    }).defaults({
        group: req.body.system,
        host: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        severity: 1,
        date: new Date()
    }).value();

    next();
}