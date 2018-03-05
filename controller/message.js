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

exports.sendMessagesConfirmLocation = function (responses, address, callback) {
    let contextOut = [
        {
            name: "0Greeting-followup",
            lifespan: 1,
            parameters: {}
        },
        {
            name: "weather-forecast",
            lifespan: 1,
            parameters: {}
        }
    ]

    let facebook = [
        {
            text: `Your location: ${address}\r\n`
        },
        {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: 'Do you want to change location?',
                    buttons: [
                        {
                            type: "postback",
                            payload: "Yes",
                            title: "Yes"
                        },
                        {
                            type: "postback",
                            payload: "choose date weather forecast",
                            title: "No"
                        }
                    ]
                }
            }
        }
    ]

    templatefb.templateTypeButtonFB(responses, '', facebook, contextOut);
}

exports.sendMessagesWeatherDetail = function (responses, result, address) {
    let contextOut = [
        {
            name: "0Greeting-followup",
            lifespan: 1,
            parameters: {}
        }
    ]

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

    templatefb.templateTypeButtonFB(responses, '', facebook, contextOut);
}

exports.sendMessagesWeather = function (responses, result, address) {
    let contextOut = [
        {
            name: "weather-ev",
            lifespan: 1,
            parameters: {}
        }
    ]

    let facebook = [
        {
            text: `Weather forecast.`
        },
        {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [
                        {
                            title: `${result.data.forecast.simpleforecast.forecastday[0].date.weekday}: ${result.data.forecast.simpleforecast.forecastday[0].date.year}-${result.data.forecast.simpleforecast.forecastday[0].date.month}-${result.data.forecast.simpleforecast.forecastday[0].date.day}`,
                            image_url: `${result.data.forecast.simpleforecast.forecastday[0].icon_url}`,
                            subtitle: `Weather: ${result.data.forecast.simpleforecast.forecastday[0].conditions} \r\n`
                                + `Temperature: ${result.data.forecast.simpleforecast.forecastday[0].low.celsius}*C - ${result.data.forecast.simpleforecast.forecastday[0].high.celsius}*C`,
                            buttons: [
                                {
                                    type: "postback",
                                    title: "View detail",
                                    payload: "weather forecast today"
                                }
                            ]
                        },
                        {
                            title: `${result.data.forecast.simpleforecast.forecastday[1].date.weekday}: ${result.data.forecast.simpleforecast.forecastday[1].date.year}-${result.data.forecast.simpleforecast.forecastday[1].date.month}-${result.data.forecast.simpleforecast.forecastday[1].date.day}`,
                            image_url: `${result.data.forecast.simpleforecast.forecastday[1].icon_url}`,
                            subtitle: `Weather: ${result.data.forecast.simpleforecast.forecastday[1].conditions} \r\n`
                                + `Temperature: ${result.data.forecast.simpleforecast.forecastday[1].low.celsius}*C - ${result.data.forecast.simpleforecast.forecastday[1].high.celsius}*C`,
                            buttons: [
                                {
                                    type: "postback",
                                    title: "View detail",
                                    payload: "weather forecast tomorrow"
                                }
                            ]
                        },
                        {
                            title: `${result.data.forecast.simpleforecast.forecastday[2].date.weekday}: ${result.data.forecast.simpleforecast.forecastday[2].date.year}-${result.data.forecast.simpleforecast.forecastday[2].date.month}-${result.data.forecast.simpleforecast.forecastday[2].date.day}`,
                            image_url: `${result.data.forecast.simpleforecast.forecastday[2].icon_url}`,
                            subtitle: `Weather: ${result.data.forecast.simpleforecast.forecastday[2].conditions} \r\n`
                                + `Temperature: ${result.data.forecast.simpleforecast.forecastday[2].low.celsius}*C - ${result.data.forecast.simpleforecast.forecastday[2].high.celsius}*C`,
                            buttons: [
                                {
                                    type: "postback",
                                    title: "View detail",
                                    payload: "weather forecast next tomorrow"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    ]

    templatefb.templateTypeButtonFB(responses, '', facebook, contextOut);
}

exports.sendMessagesNotFoundDataWeather = function (responses) {
    let speech = 'No data weather forecast.'
    let contextOut = []
    templatefb.templateMessages(responses, speech, contextOut)
}

exports.sendMesssageGreeting = function (responses, data) {
    let contextOut = [];
    let facebook = [
        {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: 'Hi ' + data.first_name + ' ' + data.last_name + ', I\'m a BotWeather, Would you like to Get Started with weather forecast?',
                    buttons: [
                        {
                            type: "postback",
                            payload: "yes",
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
    ];

    templatefb.templateTypeButtonFB(responses, '', facebook, contextOut);
}
