
const utilsConstants = require(global.rootPath + '/utils/constants');
const request = require('request');

exports.getLocationWithAddress = function(address, callback) {
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