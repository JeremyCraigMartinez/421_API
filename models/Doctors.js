var mongoose = require('mongoose');
var validEmail = require('../helpers/validate/email');

var schema = mongoose.Schema({
	_id: { type: String, trim: true, ref: 'Creds', validate: validEmail },
	specialty: { type: String, trim: true, required: true, lowercase: true },
	hospital: { type: String, trim: true, required: true, lowercase: true }
});

module.exports = mongoose.model('Doctors', schema);