const request = require('request')
const WUNDERGROUND_API_KEY = 'e41ad5ce5cd14bff'
const GOOGLE_API_KEY = 'AIzaSyDJWvFrA0oALL2-OtMRKiW0kqWIbuu2Yfc'

var getWetherWithApiWeather = (lat, long, callback) => {
    let apiWeather = `http://api.wunderground.com/api/${WUNDERGROUND_API_KEY}/conditions/forecast/q/${lat},${long}.json`
    request.get(apiWeather, (err, response, body) => {
        let data = JSON.parse(body);
        if (!err && response.statusCode === 200 && !data.response.error) {
            return callback(data)
        } else {
            return callback(null)
        }
    })
}

module.exports = {
    getWetherWithApiWeather
}