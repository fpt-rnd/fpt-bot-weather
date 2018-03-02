var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
    // id: String,
    fb_sender_id: String,
    first_name: String,
    last_name: String,
    gender: String
});

module.exports = mongoose.model('User', UserSchema);
