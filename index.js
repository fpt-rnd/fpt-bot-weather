const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const path = require('path');
const rootPath = path.dirname(require.main.filename);
global.rootPath = __dirname;

const utilsIndex = require(global.rootPath + '/utils/index');
const utilsConstants = require(global.rootPath + '/utils/constants');


// Connect to MongoDB
var config = require(global.rootPath + '/config/environment/database_info');
var mongoose = require('mongoose');
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function (err) {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1); // eslint-disable-line no-process-exit
});


app.use(bodyParser.json())
app.use(express.static(path.join(global.rootPath, 'public')));

app.set('port', (process.env.PORT || 5000))

app.get('/', function (req, res) {
  console.log(bodyParser.json());
  res.send('Use the /webhook endpoint.')
})
app.get('/webhook', function (req, res) {
  res.send('You must POST your request')
})

app.post('/webhook', function (req, res) {
  // we expect to receive JSON data from api.ai here.
  // the payload is stored on req.body

  // we have a simple authentication
  if (req.headers['auth-token'] !== utilsConstants.AUTH_TOKEN) {
    return res.status(401).send('Unauthorized')
  }

  // and some validation too
  if (!req.body || !req.body.result || !req.body.result.parameters) {
    return res.status(400).send('Bad Request')
  }

  if (!req.body.originalRequest) {
    console.log('Test on ApiAi');
    // return res.status(400).send('Test on ApiAi');
  } else {
    if (req.body.result.action == 'greeting') {
      // get user info base on chat platform
      let originalRequest = req.body.originalRequest;
      utilsIndex.greeting(res, originalRequest, function (result) {
        return result.res;
      })
    }
  }

  // the value of Action from api.ai is stored in req.body.result.action
  console.log('* Received action -- %s', req.body.result.action)
  console.log(req.body.result.fulfillment.messages);
  let reqAction = req.body.result.action;
  let location, date, startDate, endDate;
  switch (reqAction) {
    case 'weather.location.from.to':
      location = req.body.result.parameters['location'];
      startDate = req.body.result.parameters['startDate'];
      endDate = req.body.result.parameters['endDate'];

      utilsIndex.getWeatherLocationFromTo(res, location, startDate, endDate, function (result) {
        return result.res;
      });
      break;
    case 'weather.location.date':
      location = req.body.result.parameters['location'];
      date = req.body.result.parameters['date'];
      utilsIndex.getWeatherLocationWithDate(res, location, date, function (result) {
        return result.res;
      });
      break;
    case 'get.location':
      utilsIndex.getLocation(req, res, function (result) {
        return result.res;
      });
      break;
    case 'choose.date.weather.forecast':
      utilsIndex.getWeatherForecast(req, res, reqAction, function (result) {
        return result.res;
      });
      break;
    case 'weather.forecast.today':
    case 'weather.forecast.tomorrow':
    case 'weather.forecast.next.tomorrow':
      utilsIndex.getWeatherForecastDetail(req, res, reqAction, function (result) {
        return result.res;
      });
      break;
    case 'weather.location.next':
      location = req.body.result.parameters['location'];
      let days = req.body.result.parameters['days'];
      utilsIndex.getWeatherLocationNext(res, location, days, function (result) {
        return result.res;
      })
      break;
    case 'weather.give.advance':
      location = req.body.result.parameters['location'];
      date = req.body.result.parameters['date'];
      utilsIndex.giveAdvanceWeatherLocationWithDate(res, location, date);
      break;
    default:
      break;
  }
})

app.listen(app.get('port'), function () {
  console.log('* Webhook service is listening on port:' + app.get('port'))
})