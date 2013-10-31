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
var player = require('../lib/player');
var sample = require('../lib/store').sample();
var group = require('../lib/store').group();
var alert = require('../lib/store').alert();
var DEFAULT_SAMPLE = 'samples/buzzer.mp3';


module.exports = (function() {

    function init(app) {
        app.post('/alert', create);
        app.get('/alert', list)
        app.delete('/alert/:resourceId', remove);
    }


    function expose(alert) {
        return _.chain(alert)
                .omit('_id', 'resourceId')
                .extend({ url: '/alert/' + alert.resourceId })
                .value()
    }

    function create(req, res) {
        extractAlert(req, function(err, data) {
            if (err) return res.send(SC.BAD_REQUEST, err.message);
            alert.create(data, function(err, alert) {
                if (err) return res.send(SC.INTERNAL_SERVER_ERROR, err.message);
                playSample(alert, function(err) {
                    if (err) return res.send(SC.INTERNAL_SERVER_ERROR, err.message);
                    res.json(expose(alert));
                })
            })
        })
    }

    function playSample(alert, next) {
        group.get({ name: alert.group }, function(err, group) {
            if (err) return res.send(SC.INTERNAL_SERVER_ERROR, err.message);
            if (!group) return player.play(DEFAULT_SAMPLE, next);
            sample.list({ theme: group.theme }, function(err, samples) {
                if (err) return next(err);
                if (samples.length == 0) return player.play(DEFAULT_SAMPLE, next);
                player.play(randomSample(samples).path, next);
            })
        })
    }

    function randomSample(samples) {
        return samples[Math.floor(Math.random() * samples.length)];
    }

    function list(req, res) {
        extractCriteria(req, function(err, criteria) {
            alert.list(criteria, function(err, alerts) {
                if (err) return res.send(SC.INTERNAL_SERVER_ERROR, err.message);
                res.json(_.map(alerts, function(alert) {
                    return expose(alert);
                }))
            })
        })
    }

    function remove(req, res) {
        if (!req.params.resourceId) return res.send(SC.BAD_REQUEST, 'A resourceId is required')
        alert.remove(req.params.resourceId, function(err, alert) {
            if (err) return res.send(SC.INTERNAL_SERVER_ERROR, err.message);
            if (!alert) return res.send(SC.NOT_FOUND, 'The alert does not exist');
            res.send(SC.NO_CONTENT);
        })
    }

    function extractAlert(req, next) {
        if (!_.isObject(req.body)) return next(new Error('Missing body'));
        if (!req.body.system) return next(new Error('A system is required'));
        if (!req.body.type) return next(new Error('A type is required'));

        next(null, _.chain(req.body).clone().extend({
            resourceId: uuid.v1()
        }).defaults({
            group: req.body.system,
            host: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            severity: 1,
            date: new Date()
        }).value());
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