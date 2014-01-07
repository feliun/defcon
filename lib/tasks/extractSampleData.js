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

var async = require('async');
var _ = require('underscore');
var uuid = require('uuid');
var HttpError = require('../HttpError');

module.exports = function(context, req, next) {

    function isUpdate() {
        return req.params.resourceId;
    }

    function hasFile(callback) {
        return req.files && req.files.file;
    }

    function checkBody(callback) {
        _.isObject(req.body) ? callback() : callback(HttpError.badRequest('Missing body'));
    }

    function checkName(callback) {
        req.body.name ? callback() : callback(HttpError.badRequest('A name is required'));
    }

    function checkFile(callback) {
         isUpdate() || hasFile() ? callback() : callback(HttpError.badRequest('No file uploaded'));
    }

    function checkTheme(callback) {
        req.body.theme ? callback() : callback(HttpError.badRequest('A theme is required'));
    }

    function updateContext(callback) {
        var sample = _.chain(req.body)
                        .omit('files')
                        .clone()
                        .extend({
                            resourceId: isUpdate() ? req.params.resourceId : uuid.v1(),
                            environments: req.body.environments ? [].concat(req.body.environments) : [],
                            alerts: req.body.alerts ? [].concat(req.body.alerts) : [],
                            severities: req.body.severities ? [].concat(req.body.severities) : [],
                        })
                        .value();

        if (hasFile()) {
            sample.filename = req.files.file.name;
            sample.path = req.files.file.path;
            sample.contentType = req.files.file.headers['content-type'];
        };

        context.data = sample;                        
        callback();
    }

    async.series([checkBody, checkName, checkFile, checkTheme, updateContext], next);
}

