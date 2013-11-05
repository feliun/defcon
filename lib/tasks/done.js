var SC = require('http-status-codes');

module.exports = function(context, res) {
    if (context.response) return res.json(context.response);
    res.send(SC.NO_CONTENT);
}