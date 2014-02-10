/*
 * Copyright 2010 Acuminous Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use  file except in compliance with the License.
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
var sample = require('../lib/store').sample();
var tasks = require('../lib/tasks/index');
var Context = require('../lib/Context');

module.exports = (function() {

    function init(app) {
        app.post('/api/v1/sample', create);
        app.put('/api/v1/sample/:resourceId', update);
        app.get('/api/v1/sample/:resourceId/data', data)
        app.get('/api/v1/sample', list);
        app.delete('/api/v1/sample/:resourceId', remove);
    }

    function create(req, res, next) {
        var context = new Context();
        async.series([
            context.apply(tasks.extractSampleData, req),
            context.apply(tasks.createDocument, sample),
            context.apply(tasks.exposeDocument, sample)
        ], function(err) {
            if (err) return next(err);
            res.json(context.response);
        });
    }

    function update(req, res, next) {
        var context = new Context();
        async.series([
            context.apply(tasks.extractSampleData, req),
            context.apply(tasks.updateDocument, sample),
            context.apply(tasks.exposeDocument, sample)
        ], function(err) {
            if (err) return next(err);
            res.json(context.response);
        });
    }   

    function list(req, res, next) {
        var context = new Context({ criteria: req.query });
        async.series([
            context.apply(tasks.listDocuments, sample),
            context.apply(tasks.exposeDocuments, sample)
        ], function(err) {
            if (err) return next(err);
            res.json(context.response);
        });
    }

    function data(req, res, next) {
        var context = new Context();
        async.series([
            context.apply(tasks.extractResourceId, req),
            context.apply(tasks.getDocument, sample),
            context.apply(tasks.readSampleFile),
            context.apply(tasks.serveSampleFile, res)
        ], function(err) {
            if (err) return next(err);
            res.json(context.response);
        });
    }

    function remove(req, res, next) {
        var context = new Context();
        async.series([
            context.apply(tasks.extractResourceId, req),
            context.apply(tasks.removeDocument, sample),
            context.apply(tasks.unlinkSampleFile)
        ], function(err) {
            if (err) return next(err);
            res.json(context.response);
        });
    }

    return {
        init: init
    }

})();