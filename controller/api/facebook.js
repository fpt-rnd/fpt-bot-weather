const request = require('request');
const buildUrl = require('build-url');

const FACEBOOK_ACCESS_TOKEN = 'EAACJ0knhXe0BAJxhs1dH1etvKLAKSDCTIe7LFhlkyb0QYJj5JerFdohKEmop663wJGAi05zZAjbXxVjazZBzte50LZAtvfD8oLZBSm7j6m4xRw8ROyvrdgEjEWyXJGYOwqNa0ZAdaysipkg1nTwDuDJrmlspY4oQeq6n5PIBaYkAt42JZBPlZCq';
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
