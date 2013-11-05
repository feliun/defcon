var _ = require('underscore');

module.exports = (function() {
    function expose(name, document) {
        var data = _.chain(document)
                .omit('_id', 'resourceId')
                .extend({ url: '/' + name + '/' + document.resourceId })
                .value();

        if (name == 'sample') data = _.extend(data, { dataUrl: data.url + '/data' });

        return data;
    }

    return {
        expose: expose
    }
})();