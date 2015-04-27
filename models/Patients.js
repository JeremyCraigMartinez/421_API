var mongoose = require('mongoose');
var validEmail = require('../helpers/validate/email');
var validSex = require('../helpers/validate/sex');

var schema = mongoose.Schema({
	_id: { type: String, trim: true, ref: 'Creds', validate: validEmail },
	doctor: { type: String, trim: true, ref: 'Doctors', validate: validEmail },
	group: [String],
	first_name: { type: String, trim: true, required: true, lowercase: true },
	last_name: { type: String, trim: true, required: true, lowercase: true },
	age: { type: Number, required: true},
	height: { type: Number, required: true}, //in inches
	weight: { type: Number, required: true}, //in pounds
	sex: { type: String, lowercase: true, trim: true, validate: validSex }
});

module.exports = mongoose.model('Patients', schema);