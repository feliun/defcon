/*
 * Copyright 2010 Acuminous Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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