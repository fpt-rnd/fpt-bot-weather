const TYPE_FACEBOOK = 'facebook';
const TYPE_SKYPE = 'skype';
const facebookApi = require(global.rootPath + '/controller/api/facebook');
// const userModel = require(global.rootPath + '/model/redis/user');
var mongoose = require('mongoose');
const User = require(global.rootPath + '/model/mongodb/user.model');
const dbUtils = require(global.rootPath + '/model/mongodb/db_util');

exports.initUserInfo = function (type, senderId, callback) {
    let finish = function (userInfo) {
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
            //using redis
            // userModel.initUserInfo(getUserInfoResult.data, function(initUserResult) {
            //     if (initUserResult.status) {
            //         result.status = true;
            //         return callback(result);
            //     } else {
            //         return callback(result);
            //     }
            // });

            // using mongodb

            getUserInfoResult.data.fb_sender_id = senderId;
            let userData = dbUtils.createUserData(getUserInfoResult.data);
            insert("User", userData, function (outputSaveUser) {
                if (!outputSaveUser.status) {
                    result.status = false;
                } else {
                    result.status = true;
                }
                return callback(result);
            });
        } else {
            return callback(result);
        }
    })
}

exports.getUserInfo = function (type, senderId, callback) {
    let finish = function (userInfo) {
        return callback(userInfo);
    }
    switch (type) {
        case TYPE_FACEBOOK:
            getUserFacebookInfo(senderId, finish);
            break;
    }
}

var getUserFacebookInfo = function (senderId, callback) {
    // using redis
    // userModel.getUserInfo(senderId, function(result) {
    //     return callback(result);
    // })

    let result = {
        "status": false,
        "reason": "",
        "data": ""
    }
    // using mongodb
    User.find({ fb_sender_id: senderId }, function (err, outputFindUser) {
        if (err) {
            result.reason = err;
        } else {
            if (Object.keys(outputFindUser).length === 0) {
                result.reason = 'Can\'t find this user';
            } else {
                result.status = true;
                result.data = outputFindUser[0];
            }
        }
        return callback(result);
    });
}

var insert = function (modelName, data, callback) {
    // logger.debug("Step 1" + data);
    var schema = mongoose.model(modelName).schema;
    var model = new (mongoose.model(modelName, schema));
    var result = {
        "status": true,
        "_id": ''
    };

    for (fieldName in data) {
        model[fieldName] = data[fieldName];
    }

    model.save(function (err, output) {
        if (err) {
            result.status = false;
            return callback(result);
        };

        if (output._id) {
            result._id = output._id;
        }
        callback(result);
    });
}
