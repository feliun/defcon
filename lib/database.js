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

var format = require('util').format;
var MongoClient = require('mongodb').MongoClient;
var _database;

module.exports = (function() {

    function connect(host, port, next) {
        var url = format("mongodb://%s:%s/defcon?w=1", host, port);
        MongoClient.connect(url, function(err, db) {
            if (err) return next(err);
            _database = database(db);
            next(null, _database);
        })
    }

    function instance() {
        if (!_database) throw new Error('Database not connected')
        return _database;
    };

    function database(db) {

        function save(collection, data, next) {
            db.collection(collection).insert(data, { w: 1 }, next);
        }

        function list(collection, criteria, next) {
            db.collection(collection).find(criteria).toArray(next);
        }

        function get(collection, resourceId, next) {
            db.collection(collection).findOne({ resourceId: resourceId }, next);
        }

        function remove(collection, resourceId, next) {
            db.collection(collection).findAndRemove({ resourceId: resourceId },  next);
        }

        function ttl(collection, fields, seconds, next) {
            db.collection(collection).ensureIndex(fields, { expireAfterSeconds: seconds }, next);
        }

        return {
            save: save,
            list: list,
            get: get,
            remove: remove,
            ttl: ttl
        }

    };

    return {
        connect: connect,
        instance: instance
    }

})();