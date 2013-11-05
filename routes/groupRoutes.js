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

var SC = require('http-status-codes');
var _ = require('underscore');
var async = require('async');
var uuid = require('uuid');
var group = require('../lib/store').group();
var HttpError = require('../lib/HttpError');
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
        async.series([
            context.apply(extractGroupData, req),
            context.apply(createGroup),
            context.apply(exposeGroupData)
        ], function(err) {
            done(err, res, context);
        });
    }

    function update(req, res) {
        var context = new Context(this);
        async.series([
            context.apply(extractGroupData, req),
            context.apply(updateGroup),
            context.apply(exposeGroupData)
        ], function(err) {
            done(err, res, context);
        });
    }

    function list(req, res) {
        var context = new Context(this, { criteria: req.query });
        async.series([
            context.apply(listGroups),
            context.apply(exposeGroupList)
        ], function(err) {
            done(err, res, context);
        });
    }

    function remove(req, res) {
        var context = new Context(this);
        async.series([
            context.apply(extractResourceId, req),
            context.apply(removeGroup)
        ], function(err) {
            done(err, res, context);
        });
    }

    function extractGroupData(context, req, next) {

        if (!_.isObject(req.body)) return next(HttpError.badRequest('Missing body'));
        if (!req.body.name) return next(HttpError.badRequest('A name is required'));
        if (!req.body.theme) return next(HttpError.badRequest('A theme is required'));

        context.data = _.chain(req.body).clone().extend({ resourceId: uuid.v1() }).value();
        next();
    }

    function extractResourceId(context, req, next) {
        if (!req.params.resourceId) return next(HttpError.badRequest('A resourceId is required'));
        context.resourceId = req.params.resourceId;
        next();
    }

    function createGroup(context, next) {
        group.create(context.data, function(err, group) {
            context.group = group;
            next(err);
        })
    }

    function updateGroup(context, next) {
        group.update(context.data, function(err, group) {
            context.group = group;
            next(err);
        })
    }

    function listGroups(context, next) {
        group.list(context.criteria, function(err, groups) {
            context.groups = groups;
            next(err);
        })
    }

    function removeGroup(context, next) {
        group.remove(context.resourceId, function(err, group) {
            if (err) return next(HttpError.internalServerError(err.message));
            if (!group) return next(HttpError.notFound('The group does not exist'));
            next();
        })
    }

    function exposeGroupData(context, next) {
        context.response = _.chain(context.group).omit('_id', 'resourceId').extend({ url: '/group/' + context.group.resourceId }).value();
        next();
    }

    function exposeGroupList(context, next) {
        context.response = _.map(context.groups, function(group) {
            return _.chain(group).omit('_id', 'resourceId').extend({ url: '/group/' + group.resourceId }).value();
        });
        next();
    }

    function done(err, res, context) {
        if (err) return res.sendError(err);
        if (context.response) return res.json(context.response);
        res.send(SC.NO_CONTENT);
    }

    return {
        init: init
    }
})();