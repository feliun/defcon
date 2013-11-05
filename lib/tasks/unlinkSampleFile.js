module.exports = function(context, next) {
    fs.unlink(context.sample.path, next);
}