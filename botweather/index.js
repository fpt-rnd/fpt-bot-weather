const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))

const REQUIRE_AUTH = true
const AUTH_TOKEN = 'an-example-token'
const GOOGLE_API_KEY = 'AIzaSyDJWvFrA0oALL2-OtMRKiW0kqWIbuu2Yfc'
const WUNDERGROUND_API_KEY = 'e41ad5ce5cd14bff'

var lat
var long
var address

app.get('/', function (req, res) {
  res.send('Use the /webhook endpoint.')
})
app.get('/webhook', function (req, res) {
  res.send('You must POST your request')
})

app.post('/webhook', function (req, res) {
  // we expect to receive JSON data from api.ai here.
  // the payload is stored on req.body
  console.log(req.body)
  
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
      getWether(lat, long, address, res, 'today')
      break
    case 'tomorrow':
      getWether(lat, long, address, res, 'tomorrow')
      break
    case 'next_tomorrow':
      getWether(lat, long, address, res, 'next_tomorrow')
      break
    default:
      getLocation(req, res)
      break
  }

})

app.listen(app.get('port'), function () {
  console.log('* Webhook service is listening on port:' + app.get('port'))
})

var getLocation = (req, res) => { 

  if(req.body.result.action === 'get_location_input_text') {
    let textLocation = req.body.originalRequest.data.message.text
    let queryTextLocation = textLocation.replace(/ /g, '+')
    let apiTextAddress = `https://maps.google.com/maps/api/geocode/json?address=${queryTextLocation}&sensor=false`

    request.get(apiTextAddress, (err, response, body) => {
      let data = JSON.parse(body);
      if(!err && response.statusCode === 200 && data.status !== 'ZERO_RESULTS') {
        lat = data.results[0].geometry.location.lat
        long = data.results[0].geometry.location.lng
        address = data.results[0].formatted_address

        getTemplateWeather(res, address)
        //getWether(lat, long, address, res)
        
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
    })
  } else if(req.body.originalRequest.data.postback) {
    //facebook location events
    if(req.body.originalRequest.data.postback.payload === 'FACEBOOK_LOCATION') {
      lat = req.body.originalRequest.data.postback.data.lat
      long = req.body.originalRequest.data.postback.data.long

      //call api adress
      let apiAddress = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&sensor=false&key=${GOOGLE_API_KEY}`

      request.get(apiAddress, (err, response, body) => {
        let data = JSON.parse(body);
        if(!err && response.statusCode === 200 && data.status !== 'INVALID_REQUEST') {
          address = data.results[1].formatted_address;

          getTemplateWeather(res, address)
          //getWether(lat, long, address, res)
          
        } else {
          res.status(200).json({
            source: 'webhook',
            speech: 'Location is not found.',
            displayText: 'OK'
          })
        }
      })
    }
  } else {
    res.status(200).json({
      status: 'OK'
    })
  }
}

var getTemplateWeather = (res, address) => {
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

var getWether = (lat, long, address, res, day) => {
    //call api weather
  let apiWeather = `http://api.wunderground.com/api/${WUNDERGROUND_API_KEY}/conditions/forecast/q/${lat},${long}.json`

  request.get(apiWeather, (err, response, body) => {
    let data = JSON.parse(body);

    var weatherDay
    var forecastDay
    if(!err && response.statusCode === 200 && !data.response.error) {
      switch (day) {
        case 'today':
          weatherDay = 0
          forecastDay = 0
          break
        case 'tomorrow':
          weatherDay = 2
          forecastDay = 1
          break
        case 'next_tomorrow':
          weatherDay = 4
          forecastDay = 2
          break
        default:
          break
      }
      let weather = data.forecast.simpleforecast.forecastday[forecastDay].conditions
      let temperature = `${data.forecast.simpleforecast.forecastday[forecastDay].low.celsius}C - ${data.forecast.simpleforecast.forecastday[forecastDay].high.celsius}C`
      //let relative_humidity = data.current_observation.relative_humidity
      let forecast = `\r\n- ${data.forecast.txt_forecast.forecastday[weatherDay].fcttext}\r\n`
                    +`- ${data.forecast.txt_forecast.forecastday[weatherDay].fcttext_metric}\r\n`

      res.status(200).json({
        source: 'webhook',
        speech: `Your location: ${address}\r\n`
        + `Weather: ${weather}\r\n`
        + `Temperature: ${temperature}\r\n`
        + `Forecast: ${forecast}\r\n`,
        displayText: `Your location`
      })
    } else {
      res.status(200).json({
        source: 'webhook',
        speech: 'No data weather forecast.',
        displayText: 'OK'
      })
    }
  })
}

