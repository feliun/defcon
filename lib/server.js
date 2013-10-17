var express = require('express');
var cors = require('cors');
var _ = require('underscore');
var routes = require('../routes/index');

module.exports = (function(host, port, next) {

    var app = express();

    app.use(express.bodyParser({ keepExtensions: true, uploadDir: 'samples' }));
    app.use(cors());
    app.use(app.router);
    app.use("/", express.static(__dirname + '/../public'));

    function listen(host, port, next) {
        routes.init(app).listen(host, port, next);
    }

    return {
        listen: listen
    }
})();