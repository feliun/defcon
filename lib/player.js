var async = require('async');
var spawn = require('child_process').spawn;

var queue = async.queue(function(task, next) {
    spawn('afplay', [ task.file ], { stdio: 'inherit' }).on('close', next);
})

module.exports = (function() {

    function play(file, next) {
        queue.push({ file: file }, function(err) {
            if (err) console.log(err.message);
        })
        next();
    };

    return {
        play: play
    }

})();