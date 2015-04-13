var mongoose = require('mongoose');
var validEmail = require('../helpers/validate/email');

var schema = mongoose.Schema({
	_id: { type: String, ref: 'User_pass' },
	group: { type: String },
	first_name: { type: String , required: true},
	last_name: { type: String , required: true},
	age: { type: String , required: true},
	height: { type: String , required: true},
	weight: { type: String , required: true},
	sex: { type: String , required: true},
});

module.exports = mongoose.model('User_info', schema);