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

exports.getWetherForcastWithApi = function (lat, long, reqAction, callback) {
  let apiWeather = `http://api.wunderground.com/api/${utilsConstants.WUNDERGROUND_API_KEY}/conditions/forecast/q/${lat},${long}.json`

  request.get(apiWeather, (err, response, body) => {
    let data = JSON.parse(body);
    if (!err && response.statusCode === 200 && !data.response.error) {
      var weatherDay, forecastDay
      switch (reqAction) {
        case 'weather.forecast.today':
          weatherDay = 0
          forecastDay = 0
          break
        case 'weather.forecast.tomorrow':
          weatherDay = 2
          forecastDay = 1
          break
        case 'weather.forecast.next.tomorrow':
          weatherDay = 4
          forecastDay = 2
          break
        default:
          break
      }

      let weather = data.forecast.simpleforecast.forecastday[forecastDay].conditions
      let temperature = `${data.forecast.simpleforecast.forecastday[forecastDay].low.celsius}C - ${data.forecast.simpleforecast.forecastday[forecastDay].high.celsius}C`
      let forecastday = `${data.forecast.simpleforecast.forecastday[forecastDay].date.year}-${data.forecast.simpleforecast.forecastday[forecastDay].date.month}-${data.forecast.simpleforecast.forecastday[forecastDay].date.day}`
      //let relative_humidity = data.current_observation.relative_humidity
      let forecast = `\r\n- ${data.forecast.txt_forecast.forecastday[weatherDay].fcttext}\r\n`
        + `- ${data.forecast.txt_forecast.forecastday[weatherDay].fcttext_metric}\r\n`

      let result = {
        'status': true,
        'data': `Forecast day: ${forecastday}\r\n`
          + `Weather: ${weather}\r\n`
          + `Temperature: ${temperature}\r\n`
          + `Forecast: ${forecast}\r\n`
      }

      return callback(result)
    } else {
      let result = {
        'status': false,
        'data': null
      }
      return callback(result)
    }
  })
}