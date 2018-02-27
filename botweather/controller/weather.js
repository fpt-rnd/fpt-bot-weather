const moment = require('moment');
const request = require('request');
const utilsConstants = require(global.rootPath + '/utils/constants');

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