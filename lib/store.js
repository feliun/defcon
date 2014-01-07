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
var format = require('util').format;
var Mongodb = require('mongodb').MongoClient;
var db;
var FIVE_DAYS = 60 * 60 * 24 * 5;

module.exports = (function() {

    function connect(host, port, next) {
        var url = format("mongodb://%s:%s/defcon?w=1", host, port);
        Mongodb.connect(url, function(err, _db) {
            if (err) return next(err);
            db = _db;
            db.collection('alert').ensureIndex({ date: 1 }, { expireAfterSeconds: FIVE_DAYS }, next);
        })
    }

    function collection(name) {

        function create(data, next) {
            db.collection(name).insert(data, { w: 1, safe: true }, function(err, results) {
                next(err, results[0]);
            });
        }

        function update(criteria, data, next) {
            db.collection(name).findAndModify(criteria, [['_id','asc']], { $set: data }, { w: 1, safe : true }, function(err, results) {
                next(err, results)
            });
        }

        function list(criteria, next) {
            db.collection(name).find(criteria).toArray(next);
        }

        function get(criteria, next) {
            db.collection(name).findOne(criteria, next);
        }

        function remove(resourceId, next) {
            db.collection(name).findAndRemove({ resourceId: resourceId },  next);
        }

        function getName() {
            return name;
        }

        return {
            create: create,
            update: update,
            list: list,
            get: get,
            remove: remove,
            name: getName
        }
    }

    function alert() {
        return collection('alert');
    }

    function sample() {
        return collection('sample');
    }

    function group() {
        return collection('group');
    }

    return {
        connect: connect,
        group: group,
        alert: alert,
        sample: sample
    }
})();