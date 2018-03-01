const redis = require('redis');
var client = redis.createClient();

const FIRST_NAME = 'first_name';
const LAST_NAME = 'last_name';
const PROFILE_PIC = 'profile_pic';
const LOCALE = 'locale';
const TIMEZONE = 'timezone';
const GENDER = 'gender';

exports.initUserInfo = function(userData, callback) {
    let result = {
        "status": false
    }
    let firstName = lastName = profilePic = locale = timezone = gender = '';
    if (userData[FIRST_NAME]) {
        firstName = userData[FIRST_NAME];
    }
    if (userData[LAST_NAME]) {
        lastName = userData[LAST_NAME];
    }
    if (userData[PROFILE_PIC]) {
        profilePic = userData[PROFILE_PIC];
    }
    if (userData[LOCALE]) {
        locale = userData[LOCALE];
    }
    if (userData[TIMEZONE]) {
        timezone = userData[TIMEZONE];
    }

    if (userData[GENDER]) {
        gender = userData[GENDER];
    }

    let dataInsert = {
        [FIRST_NAME]: firstName,
        [LAST_NAME]: lastName,
        [PROFILE_PIC]: profilePic,
        [LOCALE]: locale,
        [TIMEZONE]: timezone,
        [GENDER]: gender
    }
    client.hmset(userData.id, dataInsert);

    result.status = true;
    return callback(result);
}

exports.getUserInfo = function(id, callback) {
    let result = {
        "status": false
    };
    client.hgetall(id, function (err, reply) {
        if (err) {
            result.error = err;
            return callback(result);
        }
        if (reply === null) {
            return callback(result);
        }
        result.status = true;
        result.data = reply;
        return callback(result);
    });
}