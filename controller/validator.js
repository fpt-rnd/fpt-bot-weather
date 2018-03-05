var validator = require('validator');
var moment = require('moment');

const location = require(global.rootPath + '/controller/api/location');

const TYPE_DATE = 'date';
const TYPE_LOCATION = 'location';

exports.validate = function(type, data, callback) {
	var result = {
		"status": false,
		"input": "",
		"expect": "",
		"reason": ""
	}

	var finish = function(validateResult) {
		return callback(validateResult);
	}

	// Validate
	switch(type) {
		case TYPE_DATE:
			isValidDate(data, finish);
			break;
		case TYPE_LOCATION:
			isValidLocation(data, finish);
			break;
	}
}

var isValidLocation = function(data, callback) {
	let result = {
		"status" : false
	};

	location.getLocationWithAddress(data, function(locationResult) {
		if (!locationResult.status) {
			return callback(result);
		} else {
			result.status = true;
			result.location = locationResult.location;
			return callback(result);
		}
	});
}

var isValidDate = function(date, callback) {
	let result = {
		"status": true
	}

	return callback(result);
}

exports.isEmptyObject = function(obj) {
	return !Object.keys(obj).length;
  }