exports.templateMessagesDataFb = function (responses, speech, facebook, contextOut) {
    responses.status(200).json({
        source: 'webhook',
        speech: speech,
        contextOut: contextOut,
        data: {
            facebook: facebook
        },
        displayText: 'OK'
    })
}

exports.templateMessages = function (responses, speech, contextOut) {
    responses.status(200).json({
        source: 'webhook',
        speech: speech,
        contextOut: contextOut,
        displayText: 'OK'
    })
}
