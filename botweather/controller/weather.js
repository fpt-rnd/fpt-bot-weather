const moment = require('moment');
const request = require('request');
const utilsConstants = require(global.rootPath + '/utils/constants');
const DATE_FORMAT_FOR_API_WWO = 'Y-MM-D';

exports.getWeatherLocationWithDate = function (location, date, callback) {
    let today = moment();
    let restUrl;
    let diffDay = today.diff(date, 'days');
    // console.log('diffday: ' + diffDay);

    if (diffDay == 0) {
        restUrl = `https://api.worldweatheronline.com/premium/v1/weather.ashx?key=${utilsConstants.WEATHER_API_KEY}&q=${location}&date=${date}&tp=1&format=json`;
    } else if (diffDay > 0) {
        restUrl = `https://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=${utilsConstants.WEATHER_API_KEY}&q=${location}&date=${date}&tp=1&format=json`;
    } else {
        restUrl = `https://api.worldweatheronline.com/premium/v1/weather.ashx?key=${utilsConstants.WEATHER_API_KEY}&q=${location}&date=${date}&tp=1&format=json`;
    }

    request.get(restUrl, (err, response, body) => {
        let result = {
            "status": false,
            "reason": "",
            "FeelsLikeC": ""
        }
        if (!err && response.statusCode == 200) {
            let json = JSON.parse(body);
            // console.log(json.data);
            if (json.data.current_condition[0].FeelsLikeC !== 'undefined') {
                result.FeelsLikeC = json.data.current_condition[0].FeelsLikeC;
            } else {
                result.FeelsLikeC = json.data.current_condition[0].maxtempC;
            }
            result.status = true;
            return callback(result);
        } else {
            result.reason = 'Can\t find the weather of this location';
            return callback(result);
        }
    });
}

exports.getWeatherLocationFromTo = function (location, startDate, endDate, callback) {
    let result = {
        "status": false,
        "reason": "",
        "FeelsLikeC": ""
    }
    let today = moment();
    let startDateTemp = moment(startDate);
    let endDateTemp = moment(endDate);
    let restUrl, temp;
    let diffDay = endDateTemp.diff(startDateTemp, 'days');

    if (today.diff(startDateTemp, 'days') == 0) {
        if (endDateTemp.diff(startDateTemp) > 14) {
            result.reason = 'We just know the weather in 14 days from now';
            return callback(result);
        } else {
            temp = 'local';
            restUrl = `https://api.worldweatheronline.com/premium/v1/weather.ashx?key=${utilsConstants.WEATHER_API_KEY}&q=${location}&date=${startDate}&num_of_days=${diff}&tp=1&format=json`;
        }
    } else {
        if (endDateTemp.diff(startDateTemp) >= 0) {
            temp = "past-weather";
            restUrl = `https://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=${utilsConstants.WEATHER_API_KEY}&q=${location}&date=${startDateTemp.format(DATE_FORMAT_FOR_API_WWO)}&enddate=${endDateTemp.format(DATE_FORMAT_FOR_API_WWO)}&tp=1&format=json`;
        } else {
            result.reason = 'From Date must be after To Date';
            return callback(result);
        }
    }

    request.get(restUrl, (err, response, body) => {
        let json = JSON.parse(body);
        if (!json.data.error) {
            switch (temp) {
                case 'local':
                    if (json.data.current_condition[0].FeelsLikeC !== 'undefined') {
                        result.FeelsLikeC = json.data.current_condition[0].FeelsLikeC;
                    } else {
                        result.FeelsLikeC = json.data.current_condition[0].maxtempC;
                    }
                    result.status = true;
                    return callback(result);
                    break;
                case 'past-weather':
                    let resultWeather = [];
                    for (let i = 0; i < json.data.weather.length; i++) {
                        let item = json.data.weather[i];
                        let itemWeather = {
                            'date': item.date,
                            'tempC': (parseInt(item.maxtempC) + parseInt(item.mintempC)) / 2
                        }
                        resultWeather.push(itemWeather);
                    }
                    result.status = true;
                    result.FeelsLikeC = resultWeather;
                    return callback(result);
                    break;
            }
        } else {
            result.reason = json.data.error;
            return callback(result);
        }
    });
}

exports.getWeatherLocationNext = function (location, days, callback) {
    let restUrl;
    let result = {
        "status": false,
        "reason": "",
        "FeelsLikeC": ""
    }

    if (days > 14) {
        result.reason = 'We can\'t estimate over 14 days';
        return callback(result);
    } else {
        days++;
        restUrl = `https://api.worldweatheronline.com/premium/v1/weather.ashx?key=${utilsConstants.WEATHER_API_KEY}&q=${location}&num_of_days=${days}&tp=1&format=json`;
    }

    console.log(restUrl);
    request.get(restUrl, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            let json = JSON.parse(body);
            let resultWeather = [];
            for (let i = 1; i < json.data.weather.length; i++) {
                let item = json.data.weather[i];
                let itemWeather = {
                    'date': item.date,
                    'tempC': (parseInt(item.maxtempC) + parseInt(item.mintempC)) / 2
                }
                resultWeather.push(itemWeather);
            }
            result.status = true;
            result.FeelsLikeC = resultWeather;
            return callback(result);
        } else {
            result.reason = 'Can\t find the weather of this location';
            return callback(result);
        }
    });
}