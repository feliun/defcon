module.exports = function(context, res) {
    res.writeHead(200, {
        'Content-Type': context.sample.contentType,
        'Content-Disposition': 'inline; filename = ' + context.sample.filename,
        'Content-Length': context.data.length
    });
    res.end(context.data, 'binary');
};