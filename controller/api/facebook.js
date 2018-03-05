const request = require('request');
const buildUrl = require('build-url');

const FACEBOOK_ACCESS_TOKEN = 'EAAHZCZADLZCfXQBADZCvK3C6MZCO1zcCDr2MhAdYUsRYLF0qUyuTJymCYtX2BGCpR4XAy6v0ZAKJS9IA2ynV01NADrg1AdNwPhdpjF18RsspRZCp55ZAFvTH82MZBPxu9IHaK8ACdsYZCSQwNZArVqDSbg3yH7Dl1DeBTec7i0mi0w7owZDZD';
const BASE_URL = 'https://graph.facebook.com/v2.6/';

exports.getUserInformation = function (id, callback) {
    let url = buildUrl(BASE_URL, {
        path: id,
        queryParams: {
            fields: 'first_name,last_name,profile_pic,locale,timezone,gender',
            access_token: FACEBOOK_ACCESS_TOKEN
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
