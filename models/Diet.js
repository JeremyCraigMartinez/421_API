var mongoose = require('mongoose');
var validEmail = require('../helpers/validate/email');
var Creds = require('./Creds');

var schema = mongoose.Schema({
	_id: {
		email: { type: String, trim: true, required: true, unique: true, ref: 'Creds', validate: validEmail },
		created: { type: Date, default: Date.now }
	},
	food: { type: String, trim: true, required: true },
	calories: { type: Number, required: true }
});

schema.pre('remove', function(next) {
	console.log('%s has been removed', this.email);
});

module.exports = mongoose.model('Doctors', schema);