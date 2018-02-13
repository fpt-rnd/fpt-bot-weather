const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const request = require('request')
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))

const REQUIRE_AUTH = true
const AUTH_TOKEN = 'botweather'
const WEATHER_API_KEY = 'b8ac2a258d1c35981149e5b29a8fa5a5';
const GOOGLE_API_KEY = 'AIzaSyDIJrE4kZI7w7jBGxQbmGneMQ3ZCSmgZ5o';

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
              speech: msg,
              displayText: msg,
              source: 'weather'});
          } else {
            return res.status(400).json({
              source: 'webhook',
              speech: 'I failed to look up the weather of this location.',
              displayText: webhookReply
            });
          }})
      } else {
        return res.status(400).json({
          source: 'webhook',
          speech: 'I failed to look up the city name.',
          displayText: webhookReply
        });
      }})
  }
  // parameters are stored in req.body.result.parameters
  var userName = req.body.result.parameters['given-name']
  var webhookReply = 'Hello ' + userName + '! Welcome from the webhook.'

  // the most basic response
  res.status(200).json({
    source: 'webhook',
    speech: webhookReply,
    displayText: webhookReply
  })
})

app.listen(app.get('port'), function () {
  console.log('* Webhook service is listening on port:' + app.get('port'))
})
