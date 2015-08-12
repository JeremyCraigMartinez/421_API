var mongoose = require('mongoose');
var validEmail = require('../helpers/validate/email');
var validDate = require('../helpers/validate/date');

var schema = mongoose.Schema({
	email: { type: String, trim: true, required: true, ref: 'Patients', validate: [validEmail,"invalid email"] },
	created: { type: String, required: true, validate: [validDate,"invalid date"] },
	data: { type: String, trim: true, required: true }
});

schema.index({email:1, created:1}, {unique: true});

module.exports = mongoose.model('Data', schema);