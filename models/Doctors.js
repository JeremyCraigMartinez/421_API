var mongoose = require('mongoose');
var validEmail = require('../helpers/validate/email');
var Creds = require('./Creds');
var Patients = require('./Patients');
var q = require('q');

var schema = mongoose.Schema({
	email: { type: String, trim: true, unique: true, ref: 'Creds', validate: validEmail },
	first_name: { type: String, trim: true, required: true, lowercase: true },
	last_name: { type: String, trim: true, required: true, lowercase: true },
	specialty: { type: String, trim: true, required: true, lowercase: true },
	hospital: { type: String, trim: true, required: true, lowercase: true }
});

schema.pre('save', function (next, req, callback) {
	console.log(next);
	console.log(req);
	console.log(callback);
	next();
});

schema.post('remove', function (doc, done) {
	Creds.remove({email:doc.email}).exec();

	Patients.update({doctor:doc.email}, {$set:{doctor:null}}, {multi:true}, function (err, removed) {
		done();
	});
});

module.exports = mongoose.model('Doctors', schema);