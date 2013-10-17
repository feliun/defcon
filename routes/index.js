module.exports.init = function(app) {

    var routes = [
        require('./alertRoutes'),
        require('./sampleRoutes')
    ];

    routes.forEach(function(route) {
        route.init(app);
    })

    return app;
}