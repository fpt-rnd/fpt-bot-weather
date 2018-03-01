const templatefb = require('./responsetemplatefb')

exports.sendMessages = function (responses, statusCode, platForm, type, context, callback) {
    responses.status(statusCode).json({
        speech: context,
        displayText: context,
        source: 'webhook'
    });

    return callback(responses);
}

exports.sendMessagesChooseDate = function (responses, address, callback) {
    let text = `Please choose date on which you want to get weather forecast in: ${address}`;
    let quickReplies = [
        {
            content_type: "text",
            payload: "get weather forecast today",
            title: "Today"
        },
        {
            content_type: "text",
            payload: "get weather forecast tomorrow",
            title: "Tomorrow"
        },
        {
            content_type: "text",
            payload: "get weather forecast next tomorrow",
            title: "Next Tomorrow"
        },
        {
            content_type: "text",
            payload: "Others",
            title: "Others"
        }
    ];

    let contextOut = [
        {
            name: "weather-ev",
            lifespan: 1,
            parameters: {}
        }
    ];

    templatefb.templateQuickReplyFB(responses, text, quickReplies, contextOut);
}

var checkLocation = 0
exports.sendMessagesNotFoundLocation = function (responses) {
    checkLocation += 1
    if (checkLocation > 3) {
        checkLocation = 0
        let speech = ''

        let facebook = [
            {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: 'You have entered the wrong address more than 3 times. Would you like to continue using BotWeather?',
                        buttons: [
                            {
                                type: "postback",
                                payload: "Yes",
                                title: "Yes"
                            },
                            {
                                type: "postback",
                                payload: "No",
                                title: "No"
                            }
                        ]
                    }
                }
            }
        ]

        let contextOut = [
            {
                name: "ask-weather",
                lifespan: 1,
                parameters: {}
            }
        ];

        templatefb.templateTypeButtonFB(responses, speech, facebook, contextOut);
    } else {
        let speech = 'Location is not found. Enter location again?'
        let contextOut = [
            {
                name: "weather-ev",
                lifespan: 0,
                parameters: {}
            },
            {
                name: "weather-bt",
                lifespan: 10,
                parameters: {}
            }
        ]

        templatefb.templateMessages(responses, speech, contextOut)
    }
}

exports.sendMessagesDataWeather = function (responses, result, address) {
    let contextOut = [
        {
            name: "ask-weather",
            lifespan: 1,
            parameters: {}
        }
    ]
    let speech = ''

    let facebook = [
        {
            text: `Your location: ${address}\r\n`
                + result.data
        },
        {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: 'Would you like to continue using BotWeather?',
                    buttons: [
                        {
                            type: "postback",
                            payload: "Yes",
                            title: "Yes"
                        },
                        {
                            type: "postback",
                            payload: "No",
                            title: "No"
                        }
                    ]
                }
            }
        }
    ]

    templatefb.templateTypeButtonFB(responses, speech, facebook, contextOut);
}

exports.sendMessagesNotFoundDataWeather = function (responses) {
    let speech = 'No data weather forecast.'
    let contextOut = []
    templatefb.templateMessages(responses, speech, contextOut)
}
