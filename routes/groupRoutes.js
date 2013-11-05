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
var group = require('../lib/store').group();
var tasks = require('../lib/tasks/index');
var Context = require('../lib/Context');

module.exports = (function() {

    function init(app) {
        app.post('/group', create);
        app.put('/group/:resourceId', update);
        app.get('/group', list)
        app.delete('/group/:resourceId', remove);
    }

    function create(req, res, next) {
        var context = new Context();
        async.series([
            context.apply(tasks.extractGroupData, req),
            context.apply(tasks.createDocument, group)
        ], function(err) {
            if (err) return next(err);
            res.json(context.response);
        });
    }

    function update(req, res, next) {
        var context = new Context();
        async.series([
            context.apply(tasks.extractGroupData, req),
            context.apply(tasks.updateDocument, group),
            context.apply(tasks.exposeDocument, group)
        ], function(err) {
            if (err) return next(err);
            res.json(context.response);
        });
    }

    function list(req, res, next) {
        var context = new Context({ criteria: req.query });
        async.series([
            context.apply(tasks.listDocuments, group),
            context.apply(tasks.exposeDocuments, group)
        ], function(err) {
            if (err) return next(err);
            res.json(context.response);
        });
    }

    function remove(req, res, next) {
        var context = new Context();
        async.series([
            context.apply(tasks.extractResourceId, req),
            context.apply(tasks.removeDocument, group)
        ], function(err) {
            if (err) return next(err);
            res.json(context.response);
        });
    }

    return {
        init: init
    }
})();