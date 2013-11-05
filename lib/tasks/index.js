var fs = require('fs');
var path = require('path');
var _ = require('underscore');

module.exports = (function() {

    function byTask(fileName) {
        if (fileName === 'index.js') return false;
        if (fileName.match(/\.js$/)) return true;
    }

    return fs.readdirSync(__dirname).filter(byTask).reduce(function(modules, fileName) {
        var moduleName = fileName.replace(/\.js$/, '');
        modules[moduleName] = require(path.join(__dirname, fileName));
        return modules;
    }, {});
})();