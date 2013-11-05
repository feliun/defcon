var _ = require('underscore');
var uuid = require('uuid');
var HttpError = require('../HttpError');

module.exports = function(req, context, next) {
    if (!_.isObject(req.body)) return next(HttpError.badRequest('Missing body'));
    if (!req.body.name) return next(HttpError.badRequest('A name is required'));
    if (!req.files || !req.files.file) return next(HttpError.badRequest('No file uploaded'));
    if (!req.body.events) return next(HttpError.badRequest('One or more events are required'));
    if (!req.body.theme) return next(HttpError.badRequest('A theme is required'));

    context.data = _.chain(req.body)
                    .omit('files')
                    .clone().extend({
                        resourceId: uuid.v1(),
                        filename: req.files.file.name,
                        path: req.files.file.path,
                        contentType: req.files.file.headers['content-type']
                    })
                    .value()
}