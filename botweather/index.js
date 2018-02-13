const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const request = require('request')
const moment = require('moment');

app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))

const REQUIRE_AUTH = true
const AUTH_TOKEN = 'botweather'
const WEATHER_API_KEY = '7a7b3e413b6d4b28ad675906181302';
const GOOGLE_API_KEY = 'AIzaSyDIJrE4kZI7w7jBGxQbmGneMQ3ZCSmgZ5o';
const WUNDERGROUND_API_KEY = 'e41ad5ce5cd14bff'

const WEATHERUNLOCKED_API_ID = 'ffe4e5e0';
const WEATHERUNLOCKED_API_KEY = 'a1f782e71cfd9cc75b1f26b5b8c2a766';

app.get('/', function (req, res) {
  res.send('Use the /webhook endpoint.')
})
app.get('/webhook', function (req, res) {
  res.send('You must POST your request')
})

app.post('/webhook', function (req, res) {
  // we expect to receive JSON data from api.ai here.
  // the payload is stored on req.body

  // we have a simple authentication
  if (REQUIRE_AUTH) {
    if (req.headers['auth-token'] !== AUTH_TOKEN) {
      return res.status(401).send('Unauthorized')
    }
  }

  // and some validation too
  if (!req.body || !req.body.result || !req.body.result.parameters) {
    return res.status(400).send('Bad Request')
  }

  // the value of Action from api.ai is stored in req.body.result.action
  console.log('* Received action -- %s', req.body.result.action)

  if (req.body.result.resolvedQuery == 'FACEBOOK_LOCATION') {
    // TODO: get weather of this location
    let lat = req.body.originalRequest.data.postback.data.lat;
    let long = req.body.originalRequest.data.postback.data.long;
    // let city = req.body.result.parameters['geo-city'];

    // get city name
    let cityUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=' + GOOGLE_API_KEY;

    request.get(cityUrl, (err, response, body) => {
      if (!err && response.statusCode == 200) {
        let json = JSON.parse(body);
        
        let city = JSON.parse(body).results[0].address_components[5].short_name;
        // get weather 
        // let restUrl = 'http://api.openweathermap.org/data/2.5/weather?APPID='+WEATHER_API_KEY+'&q='+city;
        let restUrl = 'http://api.weatherunlocked.com/api/current/' + lat + ',' + long + '?app_id='+ WEATHERUNLOCKED_API_ID + 
        '&app_key=' + WEATHERUNLOCKED_API_KEY ;

        request.get(restUrl, (err, response, body) => {
          if (!err && response.statusCode == 200) {
            let json = JSON.parse(body);
            
            return res.status(200).json({
              speech: 'success',
              displayText: 'success',
              source: 'webhook'});
          } else {
            return res.status(400).json({
              source: 'webhook',
              speech: 'I failed to look up the weather of this location.',
              displayText: 'I failed to look up the weather of this location.'
            });
          }})
      } else {
        return res.status(400).json({
          source: 'webhook',
          speech: 'I failed to look up the city name.',
          displayText: 'I failed to look up the city name.'
        });
      }})
  }

  if (req.body.result.parameters['geo-city'] !== 'undefined') {
    let city = req.body.result.parameters['geo-city'];
    let day;
    
    if (req.body.result.parameters.date !== 'undefined') {
      day = req.body.result.parameters.date;
    }

    // get weather forecast at date 
    getWeather(city, day).then((output) => {
      if (output.status) {
        var outputWeather = 'The weather forecast in ' + city + ' is: ' + output.FeelsLikeC + ' C';
        return res.status(200).json({
          source: 'webhook',
          speech: outputWeather,
          displayText: outputWeather});
      } else {
        return res.status(400).json({
          source: 'webhook',
          speech: 'Can\'t get the weather',
          displayText: 'Can\'t get the weather'});
      }
    });
  }
})

app.listen(app.get('port'), function () {
  console.log('* Webhook service is listening on port:' + app.get('port'))
})

var getWeather = function(location, date) {
  return new Promise((resolve, reject) => {
    let today = moment();
    // if (today == date) {
    //   restUrl = `https://api.worldweatheronline.com/premium/v1/weather.ashx?key=${WEATHER_API_KEY}&q=${location}&date=${date}&format=json`;
    // } else {
    //   restUrl = `https://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=${WEATHER_API_KEY}&q=${location}&date=${date}&format=json`;
    // }
    let diffDay = today.diff(date, 'days');
    let restUrl;

    if (diffDay == 0) {
      restUrl = `https://api.worldweatheronline.com/premium/v1/weather.ashx?key=${WEATHER_API_KEY}&q=${location}&date=${date}&tp=1&format=json`;
    } else if (diffDay > 0) {
      restUrl = `https://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=${WEATHER_API_KEY}&q=${location}&date=${date}&tp=1&format=json`;
    } else {
      restUrl = `https://api.worldweatheronline.com/premium/v1/weather.ashx?key=${WEATHER_API_KEY}&q=${location}&date=${date}&tp=1&format=json`;
    }

    request.get(restUrl, (err, response, body) => {
      let result = {
        'status' : true,
        'FeelsLikeC': ''
      }
      if (!err && response.statusCode == 200) {
        let json = JSON.parse(body);
        if (json.data.weather[0].FeelsLikeC !== 'undefined') {
          result.FeelsLikeC = json.data.weather[0].maxtempC;
        } else {
          result.FeelsLikeC = json.data.weather[0].FeelsLikeC;
        }
        resolve(result);
      } else {
        result.status = false;
        reject(result);
      }})
    })
}