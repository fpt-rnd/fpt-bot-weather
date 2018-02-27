exports.templateQuickReplyFB = function (responses, text, quickReplies) {
    responses.status(200).json({
        source: 'webhook',
        speech: '',
        data: {
            facebook: {
                text: text,
                quick_replies: quickReplies
            }
        },
        displayText: 'OK'
    })
}

exports.templateTypeButtonFB = function (responses, text, buttons) {
    responses.status(200).json({
        source: 'webhook',
        speech: '',
        data: {
            facebook: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: text,
                        buttons: buttons
                    }
                }
            }
        },
        displayText: 'OK'
    })
}