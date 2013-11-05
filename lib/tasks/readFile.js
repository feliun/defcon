var fs = require('fs');

module.exports = function(context, file, next) {
    fs.readFile(file.path, function(err, data) {
        context.data = data;
        next(err);
    })
}