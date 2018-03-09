const request = require('request');

const GOOGLE_API_KEY = 'AIzaSyDIJrE4kZI7w7jBGxQbmGneMQ3ZCSmgZ5o';
const GOOGLE_API = 'https://maps.google.com/maps/api/geocode/json';

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
            'address': {
                'city': null,
                'formatted_address': null
            }
        }
        // console.log("Result: " + JSON.stringify(result));
        if (!err && response.statusCode === 200 && data.status === 'OK') {
            result.status = true;
            result.lat = data.results[0].geometry.location.lat;
            result.long = data.results[0].geometry.location.lng;
            address_components = data.results[0].address_components
            address_components.forEach(address_component => {
                if (address_component.types[0] === 'administrative_area_level_1') {
                    result.address.city = address_component.long_name;
                }
            });
            result.address.formatted_address = data.results[0].formatted_address;
        }

        return callback(result);
    })
}