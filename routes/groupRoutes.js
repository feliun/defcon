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

    function create(req, res) {
        var context = new Context(this);
        tasks.execute([
            context.apply(tasks.extractGroupData, req),
            context.apply(tasks.createDocument, group),
            context.apply(tasks.exposeDocument, group),
            context.apply(tasks.done, res)
        ], res);
    }

    function update(req, res) {
        var context = new Context(this);
        tasks.execute([
            context.apply(tasks.extractGroupData, req),
            context.apply(tasks.updateDocument, group),
            context.apply(tasks.exposeDocument, group),
            context.apply(tasks.done, res)
        ], res);
    }

    function list(req, res) {
        var context = new Context(this, { criteria: req.query });
        tasks.execute([
            context.apply(tasks.listDocuments, group),
            context.apply(tasks.exposeDocuments, group),
            context.apply(tasks.done, res)
        ], res);
    }

    function remove(req, res) {
        var context = new Context(this);
        tasks.execute([
            context.apply(tasks.extractResourceId, req),
            context.apply(tasks.removeDocument, group),
            context.apply(tasks.done, res)
        ], res);
    }

    return {
        init: init
    }
})();