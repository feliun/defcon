var fs = require('fs');

module.exports = function(context, next) {
    fs.readFile(context.sample.path, function(err, data) {
        context.data = data;
        next(err);
    })
}