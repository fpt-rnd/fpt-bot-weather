const templatefb = require('./responsetemplatefb')
const fbTemplate = require('./template_builder/botBuilder')
const template_builder_fb = require('./template_builder_fb')

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

        templatefb.templateMessagesDataFb(responses, '', facebook, contextOut);
    } else {
        let speech = 'Location is not found. Enter location again?'
        let contextOut = [

        ]

        templatefb.templateMessages(responses, speech, contextOut)
    }
}

exports.sendMessagesConfirmLocation = function (req, responses, address, callback) {
    let facebook = [
        {
            text: `Your location: ${address.formatted_address}`,
            quick_replies: [
                {
                    content_type: "text",
                    payload: "choose date weather forecast",
                    title: "Yes",
                    image_url: "https://png.icons8.com/nolan/96/000000/partly-cloudy-day.png"
                },
                {
                    content_type: "text",
                    payload: "Yes",
                    title: "Others",
                    image_url: "https://png.icons8.com/nolan/96/000000/circled-right.png"
                }
            ]
        }
    ]

    let messages = req.body.result.fulfillment.messages
    const quickReply = new fbTemplate.Text(`Your location: ${address.formatted_address}`);
    for (i = 0; i < messages.length; i++) {
        if (messages[i].platform === 'facebook') {
            if (messages[i].payload.type === 'quick_reply') {
                for (j = 0; j < messages[i].payload.data.item.length; j++) {
                    quickReply
                        .addQuickReply(messages[i].payload.data.item[j].title, messages[i].payload.data.item[j].payload, messages[i].payload.data.item[j].image_url)
                }
            }
        }
    }
    
    responses.status(200).json(
        JSON.parse(
            JSON.stringify(
                new fbTemplate
                    .BaseTemplate()
                    .getApi([quickReply.get()])
            )
        )
    );

    //templatefb.templateMessagesDataFb(responses, '', facebook, []);
}

exports.sendMessagesWeatherDetail = function (req, responses, data, address) {
    // let contextOut = [
    //     {
    //         name: "0Greeting-followup",
    //         lifespan: 1,
    //         parameters: {}
    //     }
    // ]
    let facebook = [
        {
            text: `Location: ${address.formatted_address} \r\n`
                + `${data.forecastday}`
        },
        {
            attachment: {
                type: "template",
                payload: {
                    template_type: "list",
                    top_element_style: "compact",
                    elements: [
                        {
                            title: "Conditions",
                            subtitle: `${data.conditions}`,
                            image_url: `${data.image}`
                        },
                        {
                            title: "Humidity, Temp",
                            subtitle: `${data.humidity} / ${data.temperature}`,
                            image_url: "https://png.icons8.com/color/96/000000/humidity.png"
                        },
                        {
                            title: "Wind Speed",
                            subtitle: `${data.windspeed}`,
                            image_url: "https://png.icons8.com/color/96/000000/windy-weather.png"
                        },
                        {
                            title: "Snow",
                            subtitle: `${data.snow}`,
                            image_url: "https://png.icons8.com/color/96/000000/winter.png"
                        }
                    ]
                }
            }
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

    templatefb.templateMessagesDataFb(responses, '', facebook, []);
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

    templatefb.templateMessagesDataFb(responses, '', facebook, []);
}

exports.sendMessagesNotFoundDataWeather = function (responses) {
    let speech = 'No data weather forecast.'
    templatefb.templateMessages(responses, speech, [])
}

exports.sendMesssageGreeting = function (req, responses, data) {
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

    let messages = req.body.result.fulfillment.messages
    let button
    for (i = 0; i < messages.length; i++) {
        if (messages[i].platform === 'facebook') {
            if (messages[i].payload.type === 'button') {
                let title = ((messages[i].payload.data.title).replace('@first_name', data.first_name)).replace('@last_name', data.last_name)
                let item = messages[i].payload.data.item
                template_builder_fb.getButton(title, item, function(result) {
                    button = result
                }) 
            }
        }
    }

    responses.status(200).json(
        JSON.parse(
            JSON.stringify(
                new fbTemplate
                    .BaseTemplate()
                    .getApi([button.get()])
            )
        )
    );

    //templatefb.templateMessagesDataFb(responses, '', facebook, []);
}
