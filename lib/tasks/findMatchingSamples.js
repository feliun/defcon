var group = require('../store').group();
var sample = require('../store').sample();

module.exports = function(context, next) {
    group.get({ name: context.alert.group }, function(err, group) {
        if (err) return next(err);
        if (!group) return next();
        sample.list({ theme: group.theme }, function(err, samples) {
            context.samples = samples;
            next(err);
        })
    })
}