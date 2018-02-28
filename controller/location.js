
const utilsConstants = require(global.rootPath + '/utils/constants');
const request = require('request');

exports.getLocationWithAddress = function (address, callback) {
    var result = {
        "status": false,
        "location": "",
        "reason": ""
    }

    let cityUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + utilsConstants.GOOGLE_API_KEY;

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
    let apiTextAddress = `${utilsConstants.GOOGLE_API}?address=${queryTextLocation}&sensor=false&key=${utilsConstants.GOOGLE_API_KEY}`;

    request.get(apiTextAddress, (err, response, body) => {
        var data = JSON.parse(body);
        if (!err && response.statusCode === 200 && data.status !== 'ZERO_RESULTS') {
            let result = {
                'status': true,
                'lat': data.results[0].geometry.location.lat,
                'long': data.results[0].geometry.location.lng,
                'address': data.results[0].formatted_address
            }
            return callback(result);
        } else {
            let result = {
                'status': false,
                'lat': null,
                'long': null,
                'address': null
            }
            return callback(result);
        }
    })
}

exports.getLocationWithQuickReplyFB = function (lat, long, callback) {
    let apiAddress = `${utilsConstants.GOOGLE_API}?latlng=${lat},${long}&sensor=false&key=${utilsConstants.GOOGLE_API_KEY}`;
    request.get(apiAddress, (err, response, body) => {
        let data = JSON.parse(body);
        if (!err && response.statusCode === 200 && data.status !== 'INVALID_REQUEST') {
            let result = {
                'status': true,
                'lat': data.results[0].geometry.location.lat,
                'long': data.results[0].geometry.location.lng,
                'address': data.results[0].formatted_address
            }
            return callback(result);
        } else {
            let result = {
                'status': false,
                'lat': null,
                'long': null,
                'address': null
            }
            return callback(result);
        }
    })
}