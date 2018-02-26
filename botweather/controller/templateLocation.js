var checkLocation = 0

var isLocation = (res, address) => {
    res.status(200).json({
        source: 'webhook',
        speech: '',
        data: {
            facebook: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: `Please choose date on which you want to get weather forecast in: ${address}`,
                        buttons: [
                            {
                                type: "postback",
                                payload: "Today",
                                title: "Today"
                            },
                            {
                                type: "postback",
                                payload: "Tomorrow",
                                title: "Tomorrow"
                            },
                            {
                                type: "postback",
                                payload: "Next Tomorrow",
                                title: "Next Tomorrow"
                            }
                        ]
                    }
                }
            }
        },
        displayText: 'OK'
    })
}

var isNotLocation = (res) => {
    checkLocation += 1
    if (checkLocation > 3) {
        checkLocation = 0
        res.status(200).json({
            source: 'webhook',
            speech: '',
            data: {
                facebook: {
                    attachment: {
                        type: "template",
                        payload: {
                            template_type: "button",
                            text: "You have entered the wrong address more than 3 times. Would you like to continue using BotWeather?",
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
            },
            displayText: 'OK'
        })
    } else {
        res.status(200).json({
            source: 'webhook',
            speech: '',
            data: {
                facebook: {
                    attachment: {
                        type: "template",
                        payload: {
                            template_type: "button",
                            text: "Location is not found. Would you like to enter location again?",
                            buttons: [
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
                            ]
                        }
                    }
                }
            },
            displayText: 'OK'
        })
    }
}

module.exports = {
    isLocation,
    isNotLocation
}