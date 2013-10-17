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