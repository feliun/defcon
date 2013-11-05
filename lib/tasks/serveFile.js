module.exports = function(context, file, res) {
    res.writeHead(200, {
        'Content-Type': file.contentType,
        'Content-Disposition': 'inline; filename = ' + file.filename,
        'Content-Length': context.data.length
    });
    res.end(context.data, 'binary');
};