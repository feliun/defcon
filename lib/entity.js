var async = require('async');
var format = require('util').format;
var Mongodb = require('mongodb').MongoClient;
var db;

module.exports = (function() {

    function connect(host, port, next) {
        var url = format("mongodb://%s:%s/defcon?w=1", host, port);
        Mongodb.connect(url, function(err, _db) {
            if (err) return next(err);
            db = _db;
            next(null);
        })
    }

    function entity(name) {

        function create(data, next) {
            db.collection(name).insert(data, { w: 1 }, next);
        }

        function list(criteria, next) {
            db.collection(name).find(criteria).toArray(next);
        }

        function get(resourceId, next) {
            db.collection(name).findOne({ resourceId: resourceId }, next);
        }

        function remove(resourceId, next) {
            db.collection(name).findAndRemove({ resourceId: resourceId },  next);
        }

        return {
            create: create,
            list: list,
            get: get,
            remove: remove
        }
    };

    return {
        connect: connect,
        alert: entity.bind(this, 'alert'),
        sample: entity.bind(this, 'sample')
    }
})();