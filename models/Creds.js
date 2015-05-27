var mongoose = require('mongoose');
var validEmail = require('../helpers/validate/email');

var schema = mongoose.Schema({
	email: { type: String, lowercase: true, unique: true, trim: true, validate: validEmail },
	salt: { type: String, required: true },
	hash: { type: String, require: true },
	created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Creds', schema);