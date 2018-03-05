const request = require('request');

const GOOGLE_API_KEY = 'AIzaSyDIJrE4kZI7w7jBGxQbmGneMQ3ZCSmgZ5o';
const GOOGLE_API = 'https://maps.google.com/maps/api/geocode/json';

exports.getLocationWithAddress = function (address, callback) {
    var result = {
        "status": false,
        "location": "",
        "reason": ""
    }

    let cityUrl = GOOGLE_API + address + '&key=' + GOOGLE_API_KEY;

    request.get(cityUrl, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            let json = JSON.parse(body);
            let city = json.results[0].address_components[0].short_name;

            result.status = true;
            result.location = city;
            return callback(result);
        } else {
            result.reason = 'Can\'t find the city';
            return callback(result);
        }
    });
}

exports.getLocationWithTextAddress = function (queryTextLocation, callback) {
    let url = `${GOOGLE_API}?address=${queryTextLocation}&sensor=false&key=${GOOGLE_API_KEY}`;
    getLocation(url, function (result) {
        return callback(result);
    });
}

exports.getLocationWithQuickReplyFB = function (lat, long, callback) {
    let url = `${GOOGLE_API}?latlng=${lat},${long}&sensor=false&key=${GOOGLE_API_KEY}`;
    getLocation(url, function (result) {
        return callback(result);
    });
}

var getLocation = function (url, callback) {
    request.get(url, (err, response, body) => {
        let data = JSON.parse(body);
        let result = {
            'status': false,
            'lat': null,
            'long': null,
            'address': null
        }
        // console.log("Result: " + JSON.stringify(result));
        if (!err && response.statusCode === 200 && data.status === 'OK') {
            result.status = true;
            result.lat = data.results[0].geometry.location.lat;
            result.long = data.results[0].geometry.location.lng;
            result.address = data.results[0].formatted_address;
        }

        return callback(result);
    })
}