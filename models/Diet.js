var mongoose = require('mongoose');
var validEmail = require('../helpers/validate/email');
var Creds = require('./Creds');
var Patients = require('./Patients');

var schema = mongoose.Schema({
	_id: {
		email: { type: String, trim: true, required: true, unique: true, ref: 'Patients', validate: validEmail },
		created: { type: Date, default: Date.now }
	},
	food: { type: String, trim: true, required: true },
	calories: { type: Number, required: true }
});

module.exports = mongoose.model('Diets', schema);