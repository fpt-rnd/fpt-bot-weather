exports.templateQuickReplyFB = function (responses, text, quickReplies, contextOut) {
    responses.status(200).json({
        source: 'webhook',
        speech: '',
        contextOut: contextOut,
        data: {
            facebook: {
                text: text,
                quick_replies: quickReplies
            }
        },
        displayText: 'OK'
    })
}

exports.templateTypeButtonFB = function (responses, speech, facebook, contextOut) {
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
