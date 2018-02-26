const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const controllerLocation = require('./controller/controllerLocation')
const templateLocation = require('./controller/templateLocation')
const controllerWeather = require('./controller/controllerWeather')
const templateWeather = require('./controller/templateWeather')

app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))

const REQUIRE_AUTH = true
const AUTH_TOKEN = 'an-example-token'

var lat, long, address

app.get('/', function (req, res) {
  res.send('Use the /webhook endpoint.')
})
app.get('/webhook', function (req, res) {
  res.send('You must POST your request')
})

app.post('/webhook', function (req, res) {
  // we expect to receive JSON data from api.ai here.
  // the payload is stored on req.body
  //console.log(req.body)

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

  // parameters are stored in req.body.result.parameters
  var userName = req.body.result.parameters['given-name']
  var webhookReply = 'Hello ' + userName + '! Welcome from the webhook.'

  // the most basic response
  switch (req.body.result.action) {
    case 'greeting':
      res.status(200).json({
        status: 'OK'
      })
      break
    case 'today':
    case 'tomorrow':
    case 'next_tomorrow':
      controllerWeather.getWetherWithApiWeather(lat, long, (result) => {
        if (result) {
          templateWeather.isDataWeather(res, req.body.result.action, result, address)
        } else {
          templateWeather.isNotDataWeather(res)
        }
      })
      break
    default:
      getLocation(req, res)
      break
  }
})

app.post('/getLocationWithTextAddress', function (req, res) {
  controllerLocation.getLocationWithTextAddress(req.body.location, function (result) {
    res.send(result);
  });
});

app.listen(app.get('port'), function () {
  console.log('* Webhook service is listening on port:' + app.get('port'))
})

var getLocation = (req, res) => {
  if (req.body.result.action === 'get_location_input_text') {
    let textLocation = req.body.originalRequest.data.message.text
    let queryTextLocation = textLocation.replace(/ /g, '+')

    controllerLocation.getLocationWithTextAddress(queryTextLocation, (result) => {
      if (result.status === 'OK') {
        lat = result.lat
        long = result.lng
        address = result.address
        templateLocation.isLocation(res, address)
      } else {
        templateLocation.isNotLocation(res)
      }
    })

  } else if (req.body.originalRequest.data.postback) {
    //facebook location events
    if (req.body.originalRequest.data.postback.payload === 'FACEBOOK_LOCATION') {
      lat = req.body.originalRequest.data.postback.data.lat
      long = req.body.originalRequest.data.postback.data.long

      controllerLocation.getLocationWithQuickReply(lat, long, (result) => {
        if (result.status === 'OK') {
          address = result.address
          templateLocation.isLocation(res, address)
        } else {
          templateLocation.isNotLocation(res)
        }
      })
    }
  } else {
    res.status(200).json({
      status: 'OK'
    })
  }
}

