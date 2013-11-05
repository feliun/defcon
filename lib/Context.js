var _ = require('underscore');

module.exports = function(target, properties) {

    _.extend(this, properties);

    function apply() {
        var args = Array.prototype.slice.call(arguments, 0);
        var fn = args.shift();
        var args = [target, this].concat(args);
        return fn.bind.apply(fn, args);
    }

    return {
        apply: apply
    }
}