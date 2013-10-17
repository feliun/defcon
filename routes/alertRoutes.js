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
var sample = require('../lib/entity').sample();
var alert = require('../lib/entity').alert();
var DEFAULT_SAMPLES = [
    'samples/ashamed.mp3',
    'samples/bad_man.mp3',
    'samples/brain_failure.mp3',
    'samples/help_me.mp3',
    'samples/kansas_not.mp3',
    'samples/lions_tigers_bears.mp3',
    'samples/my_pretty.mp3',
    'samples/oz_wrath.mp3'
];


module.exports = (function() {

    function init(app) {
        app.post('/alert', create);
        app.get('/alert', list)
        app.delete('/alert/:resourceId', remove);
    };

    function create(req, res) {
        extractAlert(req, function(err, data) {
            if (err) return res.send(SC.BAD_REQUEST, err.message);
            var tasks = [
                createAlert.bind(this, data),
                playSample.bind(this, data)
            ];
            async.parallel(tasks, function(err) {
                if (err) return res.send(SC.INTERNAL_SERVER_ERROR, err.message);
                res.json({ resourceId: data.resourceId });
            });
        })
    }

    function createAlert(data, next) {
        alert.create(data, next);
    };

    function playSample(data, next) {
        sample.list(_.pick(data, 'system', 'severity'), function(err, samples) {
            if (err) return next(err);
            player.play(randomSample(samples) || randomSample(DEFAULT_SAMPLES), next);
        })
    };

    function randomSample(samples) {
        return samples[Math.floor(Math.random() * samples.length)];
    }

    function list(req, res) {
        extractCriteria(req, function(err, criteria) {
            alert.list(criteria, function(err, alerts) {
                if (err) return res.send(SC.INTERNAL_SERVER_ERROR, err.message);
                res.json(_.map(alerts, function(alert) {
                    return _.chain(alert).omit('resourceId', '_id').extend({ url: '/alert/' + alert.resourceId }).value();
                }))
            })
        })
    }

    function remove(req, res) {
        if (!req.params.resourceId) return res.send(SC.BAD_REQUEST, 'resourceId is required')
        alert.remove(req.params.resourceId, function(err, alert) {
            if (err) return res.send(SC.INTERNAL_SERVER_ERROR, err.message);
            if (!alert) return res.send(SC.NOT_FOUND);
            res.send(SC.NO_CONTENT);
        })
    }

    function extractAlert(req, next) {
        if (!_.isObject(req.body)) return next(new Error('Missing body'));
        if (!req.body.system) return next(new Error('system must be specified'));

        next(null, _.chain(req.body).clone().extend({
            resourceId: uuid.v1()
        }).defaults({
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