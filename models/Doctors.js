var mongoose = require('mongoose');
var validEmail = require('../helpers/validate/email');
var Creds = require('./Creds');

var schema = mongoose.Schema({
	email: { type: String, trim: true, unique: true, ref: 'Creds', validate: validEmail },
	first_name: { type: String, trim: true, required: true, lowercase: true },
	last_name: { type: String, trim: true, required: true, lowercase: true },
	specialty: { type: String, trim: true, required: true, lowercase: true },
	hospital: { type: String, trim: true, required: true, lowercase: true }
});

schema.pre('remove', function(next) {
	console.log('%s has been removed', this.email);
});

module.exports = mongoose.model('Doctors', schema);