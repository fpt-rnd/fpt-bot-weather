const request = require('request');
const buildUrl = require('build-url');

const utilsConstants = require(global.rootPath + '/utils/constants');
const BASE_URL = 'https://graph.facebook.com/v2.6/';

exports.getUserInformation = function (id, callback) {
    let url = buildUrl(BASE_URL, {
        path: id,
        queryParams: {
            fields: 'first_name,last_name,profile_pic,locale,timezone,gender',
            access_token: utilsConstants.FACEBOOK_ACCESS_TOKEN
        }
    });
    let result = {
        "status": false,
        "reason": "",
        "data": ""
    }
    request.get(url, (err, response, body) => {
        let json = JSON.parse(body);
        if (!json.error) {
            result.data = json;
            result.status = true;
            return callback(result);
        } else {
            result.reason = json.error.message;
            return callback(result);
        }
    });
}