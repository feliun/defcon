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

var sample = require('../lib/store').sample();
var tasks = require('../lib/tasks/index');
var Context = require('../lib/Context');

module.exports = (function() {

    function init(app) {
        app.post('/sample', create);
        app.get('/sample/:resourceId/data', data)
        app.get('/sample', list);
        app.delete('/sample/:resourceId', remove);
    }

    function create(req, res) {
        var context = new Context(this);
        tasks.execute([
            context.apply(tasks.extractSampleData, req),
            context.apply(tasks.createDocument, sample),
            context.apply(tasks.exposeDocument, sample),
            context.apply(tasks.done, res)
        ], res);
    }

    function list(req, res) {
        var context = new Context(this, { criteria: req.query });
        tasks.execute([
            context.apply(tasks.listDocuments, sample),
            context.apply(tasks.exposeDocuments, sample),
            context.apply(tasks.done, res)
        ], res);
    }

    function data(req, res) {
        var context = new Context(this);
        tasks.execute([
            context.apply(tasks.extractResourceId, req),
            context.apply(tasks.getDocument, sample),
            context.apply(tasks.readSampleFile),
            context.apply(tasks.serveSampleFile, res),
            context.apply(tasks.done, res)
        ], res);
    }

    function remove(req, res) {
        var context = new Context(this);
        tasks.execute([
            context.apply(tasks.extractResourceId, req),
            context.apply(tasks.removeDocument, sample),
            context.apply(tasks.unlinkSampleFile),
            context.apply(tasks.done, res)
        ], res);
    }

    return {
        init: init
    }

})();