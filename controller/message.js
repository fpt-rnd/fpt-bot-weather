const templatefb = require('./responsetemplatefb')

exports.sendMessages = function (responses, statusCode, platForm, type, context, callback) {
    responses.status(statusCode).json({
        speech: context,
        displayText: context,
        source: 'webhook'
    });

    return callback(responses);
}

var checkLocation = 0
exports.sendMessagesNotFoundLocation = function (responses) {
    checkLocation += 1
    if (checkLocation > 3) {
        checkLocation = 0
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
            
        ];

        templatefb.templateTypeButtonFB(responses, '', facebook, contextOut);
    } else {
        let speech = 'Location is not found. Enter location again?'
        let contextOut = [
            
        ]

        templatefb.templateMessages(responses, speech, contextOut)
    }
}

exports.sendMessagesConfirmLocation = function (responses, address, callback) {
    let facebook = [
        {
            text: `Your location: ${address.formatted_address}`,
            quick_replies: [
                {
                    content_type: "text",
                    payload: "choose date weather forecast",
                    title: "Yes"
                },
                {
                    content_type: "text",
                    payload: "Yes",
                    title: "Others"
                }
            ]
        }
    ]
    templatefb.templateQuickReplyFB(responses, '', facebook);
}

exports.sendMessagesWeatherDetail = function (responses, result, address) {
    // let contextOut = [
    //     {
    //         name: "0Greeting-followup",
    //         lifespan: 1,
    //         parameters: {}
    //     }
    // ]
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

    templatefb.templateTypeButtonFB(responses, '', facebook, []);
}

exports.sendMessagesWeather = function (responses, result, address) {
    let facebook = [
        {
            text: `Location: ${address.formatted_address}`
        },
        {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [
                        {
                            title: `${result.data.forecast.simpleforecast.forecastday[0].date.weekday}: ${result.data.forecast.simpleforecast.forecastday[0].date.day}/${result.data.forecast.simpleforecast.forecastday[0].date.month}/${result.data.forecast.simpleforecast.forecastday[0].date.year}`,
                            image_url: `${result.data.forecast.simpleforecast.forecastday[0].icon_url}`,
                            subtitle: `Temp: ${result.data.forecast.simpleforecast.forecastday[0].low.celsius}°C - ${result.data.forecast.simpleforecast.forecastday[0].high.celsius}°C \r\n`
                                + `Conditions: ${result.data.forecast.simpleforecast.forecastday[0].conditions}`,
                            buttons: [
                                {
                                    type: "postback",
                                    title: "View detail",
                                    payload: "weather forecast today"
                                }
                            ]
                        },
                        {
                            title: `${result.data.forecast.simpleforecast.forecastday[1].date.weekday}: ${result.data.forecast.simpleforecast.forecastday[1].date.day}/${result.data.forecast.simpleforecast.forecastday[1].date.month}/${result.data.forecast.simpleforecast.forecastday[1].date.year}`,
                            image_url: `${result.data.forecast.simpleforecast.forecastday[1].icon_url}`,
                            subtitle: `Temperature: ${result.data.forecast.simpleforecast.forecastday[1].low.celsius}°C - ${result.data.forecast.simpleforecast.forecastday[1].high.celsius}°C \r\n`
                                + `Conditions: ${result.data.forecast.simpleforecast.forecastday[1].conditions}`,
                            buttons: [
                                {
                                    type: "postback",
                                    title: "View detail",
                                    payload: "weather forecast tomorrow"
                                }
                            ]
                        },
                        {
                            title: `${result.data.forecast.simpleforecast.forecastday[2].date.weekday}: ${result.data.forecast.simpleforecast.forecastday[2].date.day}/${result.data.forecast.simpleforecast.forecastday[2].date.month}/${result.data.forecast.simpleforecast.forecastday[2].date.year}`,
                            image_url: `${result.data.forecast.simpleforecast.forecastday[2].icon_url}`,
                            subtitle: `Temperature: ${result.data.forecast.simpleforecast.forecastday[2].low.celsius}°C - ${result.data.forecast.simpleforecast.forecastday[2].high.celsius}°C\r\n`
                                + `Conditions: ${result.data.forecast.simpleforecast.forecastday[2].conditions}`,
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

    templatefb.templateTypeButtonFB(responses, '', facebook, []);
}

exports.sendMessagesNotFoundDataWeather = function (responses) {
    let speech = 'No data weather forecast.'
    templatefb.templateMessages(responses, speech, [])
}

exports.sendMesssageGreeting = function (responses, data) {
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

    templatefb.templateTypeButtonFB(responses, '', facebook, []);
}
