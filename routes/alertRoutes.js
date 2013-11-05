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
var HttpError = require('../lib/HttpError');
var Context = require('../lib/Context');
var DEFAULT_SAMPLE = { path: 'samples/buzzer.mp3' };

module.exports = (function() {

    function init(app) {
        app.post('/alert', create);
        app.get('/alert', list)
        app.delete('/alert/:resourceId', remove);
    }

    function create(req, res) {
        var context = new Context(this);
        async.series([
            context.apply(extractAlertData, req),
            context.apply(createAlert),
            context.apply(findMatchingSamples),
            context.apply(pickSample),
            context.apply(playSample),
            context.apply(exposeAlertData)
        ], function(err) {
            done(err, res, context);
        });
    }

    function list(req, res) {
        var context = new Context(this, { criteria: req.query });
        async.series([
            context.apply(listAlerts),
            context.apply(exposeAlertList)
        ], function(err) {
            done(err, res, context);
        })
    }

    function remove(req, res) {
        var context = new Context(this);
        async.series([
            context.apply(extractResourceId, req),
            context.apply(removeAlert)
        ], function(err) {
            done(err, res, context);
        });
    }

    function extractAlertData(context, req, next) {
        if (!_.isObject(req.body)) return next(HttpError.badRequest('Missing body'));
        if (!req.body.system) return next(HttpError.badRequest('A system is required'));
        if (!req.body.type) return next(HttpError.badRequest('A type is required'));

        context.data = _.chain(req.body).clone().extend({
            resourceId: uuid.v1()
        }).defaults({
            group: req.body.system,
            host: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            severity: 1,
            date: new Date()
        }).value();
        next();
    }

    function extractResourceId(context, req, next) {
        if (!req.params.resourceId) return next(HttpError.badRequest('A resourceId is required'));
        context.resourceId = req.params.resourceId;
        next();
    }

    function createAlert(context, next) {
        alert.create(context.data, function(err, alert) {
            context.alert = alert;
            next(err);
        })
    }

    function findMatchingSamples(context, next) {
        group.get({ name: alert.group }, function(err, group) {
            if (err) return next(err);
            if (!group) return next();
            sample.list({ theme: group.theme }, function(err, samples) {
                context.samples = samples;
                next(err);
            })
        })
    }

    function pickSample(context, next) {
        context.sample = context.samples ? context.samples[Math.floor(Math.random() * context.samples.length)] : DEFAULT_SAMPLE;
        next();
    }

    function playSample(context, next) {
        player.play(context.sample.path, next);
    }

    function listAlerts(context, next) {
        alert.list(context.criteria, function(err, alerts) {
            context.alerts = alerts;
            next(err);
        })
    }

    function removeAlert(context, next) {
        alert.remove(context.resourceId, function(err, alert) {
            if (err) return next(HttpError.internalServerError(err.message));
            if (!alert) return next(HttpError.notFound('The alert does not exist'));
            next();
        })
    }

    function exposeAlertData(context, next) {
        context.response = _.chain(context.alert)
            .omit('_id', 'resourceId')
            .extend({ url: '/alert/' + alert.resourceId })
            .value()
        next();
    }

    function exposeAlertList(context, next) {
        context.response = _.map(context.alerts, function(alert) {
            return _.chain(alert).omit('_id', 'resourceId').extend({ url: '/alert/' + alert.resourceId }).value();
        })
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