const templatefb = require('./templatefb')

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
            payload: "Today",
            title: "Today"
        },
        {
            content_type: "text",
            payload: "Tomorrow",
            title: "Tomorrow"
        },
        {
            content_type: "text",
            payload: "Next Tomorrow",
            title: "Next Tomorrow"
        },
        {
            content_type: "text",
            payload: "Others",
            title: "Others"
        }
    ];

    templatefb.templateQuickReplyFB(responses, text, quickReplies);
}

var checkLocation = 0
exports.sendMessagesNotFoundLocation = function (responses) {
    checkLocation += 1
    if (checkLocation > 3) {
        checkLocation = 0
        let text = 'You have entered the wrong address more than 3 times. Would you like to continue using BotWeather?'
        let buttons = [
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
        ];

        templatefb.templateTypeButtonFB(responses, text, buttons);
    } else {
        let text = 'Location is not found. Would you like to enter location again?'
        let buttons = [
            {
                type: "postback",
                payload: "location",
                title: "Yes"
            },
            {
                type: "postback",
                payload: "No",
                title: "No"
            }
        ];

        templatefb.templateTypeButtonFB(responses, text, buttons);
    }
}

exports.sendMessagesDataWeather = function (responses, result, address) {
    responses.status(200).json({
        source: 'webhook',
        speech: `Your location: ${address}\r\n`
            + result.data,
        displayText: `Your location`
    })
}

exports.sendMessagesNotFoundDataWeather = function (responses) {
    responses.status(200).json({
        source: 'webhook',
        speech: 'No data weather forecast.',
        displayText: 'OK'
    })
}
