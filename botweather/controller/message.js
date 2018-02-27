

exports.sendMessages = function (responses, statusCode, platForm, type, context, callback) {
    responses.status(statusCode).json({ 
        speech: context,
        displayText: context,
        source: 'webhook'});

    return callback(responses);
}