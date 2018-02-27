const request = require('request')
const moment = require('moment');
const message = require(global.rootPath + '/controller/message');
const validator = require(global.rootPath + '/controller/validator');
const weather = require(global.rootPath + '/controller/weather');

exports.getWeatherLocationWithDate = function(res, location, date, callback) {
    validator.validate('location', location, function(isValid) {
        console.log(isValid);
        if(isValid.status) {
            validator.validate('date', date, function(isValidDate) {
                if(isValidDate.status) {
                   weather.getWeatherLocationWithDate(isValid.location, date, function(weatherOfDate) {
                       if (weatherOfDate.status) {
                        var outputWeather = 'The weather forecast in ' + location + ' is: ' + weatherOfDate.FeelsLikeC + ' C';
                        message.sendMessages(res, 200, '', '', outputWeather, function(result) { 
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

exports.getWeatherLocationFromTo = function(res, location, startDate, endDate, callback) {
}

exports.getWeatherCityToday = function(res, city, callback) {

}