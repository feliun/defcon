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

var HttpStatusCodes = require('http-status-codes');
var _ = require('underscore');
var changeCase = require('change-case');

function HttpError(message, code) {
    this.constructor.prototype.__proto__ = Error.prototype;
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.code = code || HttpStatusCodes.INTERNAL_SERVER_ERROR;
}

function byStatusCode(name) {
    return _.isNumber(HttpStatusCodes[name]);
}

function makeHelperMethod(name) {
    var functionName = changeCase.camel(name);
    HttpError[functionName] = function(message) {
        return new HttpError(message, HttpStatusCodes[name]);
    }
}

HttpError.handler = function(err, req, res, next) {
    if (err.name == 'HttpError') return res.send(err.code, err.message);
    res.send(HttpStatusCodes.INTERNAL_SERVER_ERROR, err.message);
}

_.chain(HttpStatusCodes).keys().filter(byStatusCode).each(makeHelperMethod);


module.exports = HttpError;