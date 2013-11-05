var player = require('../player');

module.exports = function(context, next) {
    player.play(context.sample.path, next);
}