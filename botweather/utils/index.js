const request = require('request')
const moment = require('moment');
const message = require(global.rootPath + '/controller/message');
const validator = require(global.rootPath + '/controller/validator');
const weather = require(global.rootPath + '/controller/weather');
const location = require(global.rootPath + '/controller/location');

var lat, long, address

exports.getWeatherLocationWithDate = function (res, location, date, callback) {
    validator.validate('location', location, function (isValid) {
        console.log(isValid);
        if (isValid.status) {
            validator.validate('date', date, function (isValidDate) {
                if (isValidDate.status) {
                    weather.getWeatherLocationWithDate(isValid.location, date, function (weatherOfDate) {
                        if (weatherOfDate.status) {
                            var outputWeather = 'The weather forecast in ' + location + ' is: ' + weatherOfDate.FeelsLikeC + ' C';
                            message.sendMessages(res, 200, '', '', outputWeather, function (result) {
                                return result.res;
                            });
                        }
                    })

                }
            })
        }
    })
    return callback(res);

}

exports.getWeatherLocationFromTo = function (res, location, startDate, endDate, callback) {
}

exports.getLocation = function (req, res, callback) {
    if (req.body.result.action === 'get.location.input.text') {
        let textLocation = req.body.originalRequest.data.message.text;
        let queryTextLocation = textLocation.replace(/ /g, '+');

        location.getLocationWithTextAddress(queryTextLocation, function (result) {
            if (result.status) {
                lat = result.lat;
                long = result.long;
                address = result.address;
                message.sendMessagesChooseDate(res, address);
            } else {
                message.sendMessagesNotFoundLocation(res);
            }
        })

    } else if (req.body.result.action === 'facebook.location') {
        //facebook location events
        lat = req.body.originalRequest.data.postback.data.lat;
        long = req.body.originalRequest.data.postback.data.long;

        location.getLocationWithQuickReplyFB(lat, long, function (result) {
            if (result.status) {
                address = result.address;
                message.sendMessagesChooseDate(res, address);
            } else {
                message.sendMessagesNotFoundLocation(res);
            }
        })

    } else {
        res.status(200).json({
            status: 'OK'
        })
    }
}

exports.getWeatherCityDay = function (req, res, reqAction) {
    weather.getWetherForcastWithApi(lat, long, reqAction, function (result) {
        if (result.status) {
            message.sendMessagesDataWeather(res, result, address)
        } else {
            message.sendMessagesNotFoundDataWeather(res)
        }
    })
}