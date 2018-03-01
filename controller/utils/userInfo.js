const TYPE_FACEBOOK = 'facebook';
const TYPE_SKYPE = 'skype';
const facebookApi = require(global.rootPath + '/controller/api/facebook');
const userModel = require(global.rootPath + '/model/redis/user');

exports.initUserInfo = function(type, senderId, callback) {
    let finish = function(userInfo) {
        return callback(userInfo);
    }
    switch (type) {
        case TYPE_FACEBOOK:
            initUserFacebookInfo(senderId, finish);
            break;
    }
}

var initUserFacebookInfo = function (senderId, callback) {
    let result = {
        "status": false
    }
    facebookApi.getUserInformation(senderId, function (getUserInfoResult) {
        if (getUserInfoResult.status) {
            userModel.initUserInfo(getUserInfoResult.data, function(initUserResult) {
                if (initUserResult.status) {
                    result.status = true;
                    return callback(result);
                } else {
                    return callback(result);
                }
            })
        } else {
            return callback(result);
        }
    })
}

exports.getUserInfo = function(type, senderId, callback) {
    let finish = function(userInfo) {
        return callback(userInfo);
    }
    switch (type) {
        case TYPE_FACEBOOK:
            getUserFacebookInfo(senderId, finish);
            break;
    }
}

var getUserFacebookInfo = function(senderId, callback) {
    userModel.getUserInfo(senderId, function(result) {
        return callback(result);
    })
}