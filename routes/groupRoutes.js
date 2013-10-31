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


module.exports = (function() {

    function init(app) {
        app.post('/group', create);
        app.put('/group/:resourceId', update);
        app.get('/group', list)
        app.delete('/group/:resourceId', remove);
    }

    function expose(group) {
        return _.chain(group).omit('_id', 'resourceId').extend({ url: '/group/' + group.resourceId }).value()
    }

    function create(req, res) {
        extractGroupData(req, function(err, data) {
            if (err) return res.send(SC.BAD_REQUEST, err.message);
            group.create(data, function(err, group) {
                if (err) return res.send(SC.INTERNAL_SERVER_ERROR, err.message);
                res.json(expose(group));
            })
        })
    }

    function update(req, res) {
        extractGroupData(req, function(err, data) {
            if (err) return res.send(SC.BAD_REQUEST, err.message);
            group.update(data, function(err, group) {
                if (err) return res.send(SC.INTERNAL_SERVER_ERROR, err.message);
                res.json(expose(group));
            })
        })
    }

    function list(req, res) {
        extractCriteria(req, function(err, criteria) {
            group.list(criteria, function(err, groups) {
                if (err) return res.send(SC.INTERNAL_SERVER_ERROR, err.message);
                res.json(_.map(groups, expose))
            })
        })
    }

    function remove(req, res) {
        if (!req.params.resourceId) return res.send(SC.BAD_REQUEST, 'A resourceId is required')
        group.remove(req.params.resourceId, function(err, group) {
            if (err) return res.send(SC.INTERNAL_SERVER_ERROR, err.message);
            if (!group) return res.send(SC.NOT_FOUND, 'The group does not exist');
            res.send(SC.NO_CONTENT);
        })
    }

    function extractCriteria(req, next) {
        next(null, _.reduce(req.query, function(criteria, value, key) {
            criteria[key] = value;
            return criteria;
        }, {}))
    }

    function extractGroupData(req, next) {
        if (!_.isObject(req.body)) return next(new Error('Missing body'));
        if (!req.body.name) return next(new Error('A name is required'));
        if (!req.body.theme) return next(new Error('A theme is required'));

        next(null, _.chain(req.body).clone().extend({
            resourceId: uuid.v1()
        }).value());
    }

    return {
        init: init
    }
})();