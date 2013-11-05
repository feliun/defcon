var _ = require('underscore');

module.exports = (function() {
    function expose(name, document) {
        return _.chain(document)
                .omit('_id', 'resourceId')
                .extend({ url: '/' + name + '/' + document.resourceId })
                .value();
    }

    return {
        expose: expose
    }
})();