const request = require('request')
const WUNDERGROUND_API_KEY = 'e41ad5ce5cd14bff'
const GOOGLE_API_KEY = 'AIzaSyDJWvFrA0oALL2-OtMRKiW0kqWIbuu2Yfc'
const GOOGLE_API = 'https://maps.google.com/maps/api/geocode/json'

var getLocationWithTextAddress = (queryTextLocation, callback) => {
    let apiTextAddress = `${GOOGLE_API}?address=${queryTextLocation}&sensor=false&key=${GOOGLE_API_KEY}`
    request.get(apiTextAddress, (err, response, body) => {
        var data = JSON.parse(body)
        if (!err && response.statusCode === 200 && data.status !== 'ZERO_RESULTS') {
            let json = {
                'status': data.status,
                'lat': data.results[0].geometry.location.lat,
                'long': data.results[0].geometry.location.lng,
                'address': data.results[0].formatted_address
            }
            return callback(json)
        } else {
            let json = {
                'status': 'Failed',
                'lat': null,
                'long': null,
                'address': null
            }
            return callback(json)
        }
    })
}

var getLocationWithQuickReply = (lat, long, callback) => {
    let apiAddress = `${GOOGLE_API}?latlng=${lat},${long}&sensor=false&key=${GOOGLE_API_KEY}`
    request.get(apiAddress, (err, response, body) => {
        let data = JSON.parse(body)
        if (!err && response.statusCode === 200 && data.status !== 'INVALID_REQUEST') {
            let json = {
                'status': data.status,
                'lat': data.results[0].geometry.location.lat,
                'long': data.results[0].geometry.location.lng,
                'address': data.results[0].formatted_address
            }
            return callback(json)
        } else {
            let json = {
                'status': 'Failed',
                'lat': null,
                'long': null,
                'address': null
            }
            return callback(json)
        }
    })
}

module.exports = {
    getLocationWithTextAddress,
    getLocationWithQuickReply
}