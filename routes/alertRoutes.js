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
var event = require('../lib/store').event();
var tasks = require('../lib/tasks/index');
var Context = require('../lib/Context');

module.exports = (function() {

    function init(app) {
        app.post('/alert', create);
    }

    function create(req, res, next) {
        var context = new Context();
        async.series([
            context.apply(tasks.extractAlertData, req),
            context.apply(tasks.createDocument, event),
            context.apply(tasks.findMatchingSamples),
            context.apply(tasks.pickSample),
            context.apply(tasks.playSample),
            context.apply(tasks.exposeDocument, event)
        ], function(err) {
            if (err) return next(err);
            res.json(context.response);
        });
    }

    return {
        init: init
    }
})();