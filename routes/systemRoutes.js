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
var system = require('../lib/store').system();
var tasks = require('../lib/tasks/index');
var Context = require('../lib/Context');

module.exports = (function() {

    function init(app) {
        app.post('/api/v1/system', create);
        app.put('/api/v1/system/:resourceId', update);
        app.get('/api/v1/system', list)
        app.delete('/api/v1/system/:resourceId', remove);
    }

    function create(req, res, next) {
        var context = new Context();
        async.series([
            context.apply(tasks.extractSystemData, req),
            context.apply(tasks.createDocument, system)
        ], function(err) {
            if (err) return next(err);
            res.json(context.response);
        });
    }

    function update(req, res, next) {
        var context = new Context();
        async.series([
            context.apply(tasks.extractSystemData, req),
            context.apply(tasks.updateDocument, system),
            context.apply(tasks.exposeDocument, system)
        ], function(err) {
            if (err) return next(err);
            res.json(context.response);
        });
    }

    function list(req, res, next) {
        var context = new Context({ criteria: req.query });
        async.series([
            context.apply(tasks.listDocuments, system),
            context.apply(tasks.exposeDocuments, system)
        ], function(err) {
            if (err) return next(err);
            res.json(context.response);
        });
    }

    function remove(req, res, next) {
        var context = new Context();
        async.series([
            context.apply(tasks.extractResourceId, req),
            context.apply(tasks.removeDocument, system)
        ], function(err) {
            if (err) return next(err);
            res.json(context.response);
        });
    }

    return {
        init: init
    }
})();