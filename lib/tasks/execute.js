var async = require('async');

module.exports = function(workflow, res) {
    async.series(workflow, function(err) {
        if (err) res.sendError(err);
    })
};