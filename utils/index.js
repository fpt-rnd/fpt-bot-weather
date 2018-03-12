const request = require('request')
const moment = require('moment');
const qs = require('querystring');
const message = require(global.rootPath + '/controller/message');
const validator = require(global.rootPath + '/controller/validator');
const weather = require(global.rootPath + '/controller/api/weather');
const location = require(global.rootPath + '/controller/api/location');
const utilsUserInfo = require(global.rootPath + '/controller/utils/userInfo');

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
        } else {
            message.sendMessages(res, 400, '', '', 'We can\'t find the city', function (result) {
                return result.res;
            });
        }
    })
    return callback(res);
}

exports.getWeatherLocationFromTo = function (res, location, startDate, endDate, callback) {
    validator.validate('location', location, function (isValid) {
        if (isValid.status) {
            validator.validate('date', startDate, function (isValidStartDate) {
                if (isValidStartDate.status) {
                    validator.validate('date', endDate, function (isValidEndDate) {
                        if (isValidEndDate.status) {
                            weather.getWeatherLocationFromTo(isValid.location, startDate, endDate, function (weatherInDateRange) {
                                if (weatherInDateRange.status) {
                                    let outputWeather = '';
                                    if (Array.isArray(weatherInDateRange.FeelsLikeC)) {
                                        weatherInDateRange.FeelsLikeC.forEach(element => {
                                            outputWeather += 'The weather forecast in ' + isValid.location + ' of ' + element.date + ' is: ' + element.tempC + ' C \n';
                                        });
                                    } else {
                                        outputWeather = 'The weather forecast in ' + location + ' is: ' + weatherOfDate.FeelsLikeC + ' C';
                                    }
                                    message.sendMessages(res, 200, '', '', outputWeather, function (result) {
                                        return result.res;
                                    });
                                } else {
                                    message.sendMessages(res, 200, '', '', weatherInDateRange.reason[0].msg, function (result) {
                                        return result.res;
                                    });
                                }
                            })
                        } else {

                        }
                    })
                } else {
                }
            })
        } else {

        }
    })
    return callback(res);
}

exports.getWeatherLocationNext = function (res, location, days, callback) {
    validator.validate('location', location, function (isValid) {
        if (isValid.status) {
            weather.getWeatherLocationNext(isValid.location, days, function (weatherNextDate) {
                if (weatherNextDate.status) {
                    let outputWeather = '';
                    if (Array.isArray(weatherNextDate.FeelsLikeC)) {
                        weatherNextDate.FeelsLikeC.forEach(element => {
                            outputWeather += 'The weather forecast in ' + isValid.location + ' of ' + element.date + ' is: ' + element.tempC + ' C \n';
                        });
                    } else {
                        outputWeather = 'The weather forecast in ' + location + ' is: ' + weatherNextDate.FeelsLikeC + ' C';
                    }
                    message.sendMessages(res, 200, '', '', outputWeather, function (result) {
                        return result.res;
                    });
                }
            })
        } else {
            message.sendMessages(res, 400, '', '', 'We can\'t find the city', function (result) {
                return result.res;
            });
        }
    })
    return callback(res);
}

exports.getLocation = function (req, res, callback) {
    if (req.body.originalRequest.data.message && req.body.result.action !== 'ask.weather') {
        let textLocation = req.body.originalRequest.data.message.text;
        // let queryTextLocation = textLocation.replace(/ /g, '+');

        location.getLocationWithTextAddress(qs.escape(textLocation), function (result) {
            if (result.status) {
                lat = result.lat;
                long = result.long;
                address = result.address;
                message.sendMessagesConfirmLocation(req, res, address);
            } else {
                message.sendMessagesNotFoundLocation(res);
            }
        })

    } else if (req.body.originalRequest.data.postback) {
        //facebook location events
        lat = req.body.originalRequest.data.postback.data.lat;
        long = req.body.originalRequest.data.postback.data.long;

        location.getLocationWithQuickReplyFB(lat, long, function (result) {
            if (result.status) {
                address = result.address;
                message.sendMessagesConfirmLocation(req, res, address);
            } else {
                message.sendMessagesNotFoundLocation(res);
            }
        })
    } else if (req.body.result.action === 'ask.weather') {
        let textLocation = req.body.result.parameters['location']
        location.getLocationWithTextAddress(qs.escape(textLocation), function (result) {
            if (result.status) {
                lat = result.lat;
                long = result.long;
                address = result.address;
                message.sendMessagesConfirmLocation(req, res, address);
            } else {
                message.sendMessagesNotFoundLocation(res);
            }
        })
    }
    return callback(res);
}

exports.getWeatherForecast = function (req, res, reqAction, callback) {
    weather.getWetherForcastWithApi(lat, long, reqAction, function (result) {
        if (result.status) {
            message.sendMessagesWeather(res, result, address)
        } else {
            message.sendMessagesNotFoundDataWeather(res)
        }
    })

    return callback(res);
}

exports.getWeatherForecastDetail = function (req, res, reqAction, callback) {
    weather.getWetherForcastWithApi(lat, long, reqAction, function (result) {
        if (result.status) {
            data = result.data;
            message.sendMessagesWeatherDetail(req, res, data, address)
        } else {
            message.sendMessagesNotFoundDataWeather(res)
        }
    })

    return callback(res);
}

exports.greeting = function (req, res, originalRequest, callback) {
    utilsUserInfo.getUserInfo(originalRequest.source, originalRequest.data.sender.id, function (result) {
        if (!result.status) {
            utilsUserInfo.initUserInfo(originalRequest.source, originalRequest.data.sender.id, function (resultInit) {
                utilsUserInfo.getUserInfo(originalRequest.source, originalRequest.data.sender.id, function (result) {
                    let outputMessage = {
                        'first_name': result.data.first_name,
                        'last_name': result.data.last_name
                    }
                    message.sendMesssageGreeting(req, res, outputMessage);
                });
            });
        } else {
            let outputMessage = {
                'first_name': result.data.first_name,
                'last_name': result.data.last_name
            }
            message.sendMesssageGreeting(req, res, outputMessage);
        }
    });
    return callback(res);
}

exports.giveAdvanceWeatherLocationWithDate = function (res, city, date) {
    location.getLocationWithTextAddress(qs.escape(city), function (resultLocation) {
        if (resultLocation.status) {
            let reqAction = '';
            switch (date) {
                case 'today':
                    reqAction = 'weather.forecast.today';
                    break
                case 'tomorrow':
                    reqAction = 'weather.forecast.tomorrow';
                    break
                case 'next tomorrow':
                    reqAction = 'weather.forecast.next.tomorrow';
                    break;
                default:
                    message.sendMessages(res, 200, '', '', 'We only give advance within next 2 days', function (result) { });
                    break;
            }
            if (reqAction != '') {
                weather.getWetherForcastWithApi(resultLocation.lat, resultLocation.long, reqAction, function (result) {
                    if (result.status) {
                        giveAdvanceBaseOnWeather(res, result.data, address);
                    } else {
                        message.sendMessagesNotFoundDataWeather(res)
                    };
                })
            }
        } else {
            message.sendMessages(res, 200, '', '', 'Can\'t find the location', function (result) { });
        }
    });
}

var giveAdvanceBaseOnWeather = function (res, weather, address) {
    let advanceMessage = '';
    switch (weather.conditions) {
        case 'Rain':
        case 'Chance of Rain':
            advanceMessage = 'You should bring your the umbrella';
            break;
        case 'Mostly Cloudy':
        case 'Partly Cloudy':
            advanceMessage = 'It\'s great to participate in outdoor activities';
            break;
        case 'Scattered Clouds':
        case 'Clear':
            advanceMessage = 'Should bring something to cover your head';
            break;
        default:
            advanceMessage = 'Enjoy your day';
            break;
    }

    message.sendMessages(res, 200, '', '', advanceMessage, function (result) { });
}
