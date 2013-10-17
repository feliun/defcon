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
var uuid = require('uuid');
var async = require('async');
var fs = require('fs');
var sample = require('../lib/entity').sample();

module.exports = (function() {

    function init(app) {
        app.post('/sample', create);
        app.get('/sample/:resourceId', get)
        app.get('/sample/:resourceId/data', data)
        app.get('/sample', list);
        app.delete('/sample/:resourceId', remove);
    }

    function create(req, res) {
        extractSampleData(req, function(err, data) {
            if (err) return res.send(SC.BAD_REQUEST, err.message);
            sample.create(data, function(err, sample) {
                if (err) return res.send(SC.INTERNAL_SERVER_ERROR, err.message);
                res.json({ resourceId: sample.resourceId });
            })
        })
    }

    function list(req, res) {
        extractCriteria(req, function(err, criteria) {
            sample.list(criteria, function(err, samples) {
                if (err) return res.send(SC.INTERNAL_SERVER_ERROR, err.message);
                res.json(_.map(samples, function(sample) {
                    return _.chain(sample).pick('name', 'filename', 'contentType').extend({
                        url: '/sample/' + sample.resourceId,
                        dataUrl: '/sample/' + sample.resourceId + '/data'
                    }).value()
                }))
            })
        })
    }

    function get(req, res) {
        if (!req.params.resourceId) return res.send(SC.BAD_REQUEST, 'resourceId is required')
        sample.get(req.params.resourceId, function(err, sample) {
            if (err) return res.send(SC.INTERNAL_SERVER_ERROR, err.message);
            if (!sample) return res.send(SC.NOT_FOUND);
            res.json(_.chain(sample).omit('resourceId', '_id').extend({
                dataUrl: '/sample/' + sample.resourceId + '/data'
            }))
        })
    }

    function data(req, res) {
        if (!req.params.resourceId) return res.send(SC.BAD_REQUEST, 'resourceId is required')
        sample.get(req.params.resourceId, function(err, sample) {
            if (err) return res.send(SC.INTERNAL_SERVER_ERROR, err.message);
            if (!sample) return res.send(SC.NOT_FOUND);
            fs.readFile(sample.path, function(err, data) {
                if (err) return res.send(SC.INTERNAL_SERVER_ERROR, err.message);
                res.writeHead(200, {
                    'Content-Type': sample.contentType,
                    'Content-Disposition': 'inline; filename = ' + sample.filename,
                    'Content-Length': data.length
                });
                res.end(data, 'binary');
            })
        })
    }

    function remove(req, res) {
        if (!req.params.resourceId) return res.send(SC.BAD_REQUEST, 'resourceId is required')
        sample.remove(req.params.resourceId, function(err, sample) {
            if (err) return res.send(SC.INTERNAL_SERVER_ERROR, err.message);
            if (!sample) return res.send(SC.NOT_FOUND);
            fs.unlink(sample.path, function(err) {
                if (err) return res.send(SC.INTERNAL_SERVER_ERROR, err.message);
                res.send(SC.NO_CONTENT);
            })
        })
    }

    function extractSampleData(req, next) {
        if (!_.isObject(req.body)) return next(new Error('Missing body'));
        if (_.keys(req.body).length == 0) return next(new Error('Meta data must be specified'));
        if (!req.files.file) return (new Error('No file uploaded'));
        next(null, _.chain(req.body).omit('files').clone().extend({
            resourceId: uuid.v1(),
            filename: req.files.file.name,
            path: req.files.file.path,
            contentType: req.files.file.headers['content-type']
        }).value())
    }

    function extractCriteria(req, next) {
        next(null, _.reduce(req.query, function(criteria, value, key) {
            criteria[key] = value;
            return criteria;
        }, {}))
    }

    return {
        init: init
    }

})();