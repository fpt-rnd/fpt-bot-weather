var moment = require('moment');

exports.createUserData = function(user) {
  console.log("Enrypt 1");
  let userData = {};

  if (user.fb_sender_id) {
    userData['fb_sender_id'] = user.fb_sender_id;
  }

  if (user.first_name) {
    userData['first_name'] = user.first_name;
  }

  if (user.last_name) {
    userData['last_name'] = user.last_name;
  }

  if (user.gender) {
    userData['gender'] = user.gender;
  }

  console.log("User Data: " + JSON.stringify(userData));
  return userData;
}
