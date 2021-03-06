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

var express = require('express');
var cors = require('cors');
var _ = require('underscore');
var routes = require('../routes/index');
var HttpError = require('./HttpError');

module.exports = (function(host, port, next) {

    var app = express();

    app.use(express.bodyParser({ keepExtensions: true, uploadDir: 'samples' }));
    app.use(cors());
    app.use(app.router);
    app.use("/", express.static(__dirname + '/../public'));
    app.use(HttpError.handler);

    function listen(host, port, next) {
        routes.init(app).listen(host, port, next);
    }

    return {
        listen: listen
    }
})();