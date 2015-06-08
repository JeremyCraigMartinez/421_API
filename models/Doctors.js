var mongoose = require('mongoose');
var validEmail = require('../helpers/validate/email');
var Creds = require('./Creds');
var Patients = require('./Patients');

var schema = mongoose.Schema({
	email: { type: String, trim: true, unique: true, ref: 'Creds', validate: validEmail },
	first_name: { type: String, trim: true, required: true, lowercase: true },
	last_name: { type: String, trim: true, required: true, lowercase: true },
	specialty: { type: String, trim: true, required: true, lowercase: true },
	hospital: { type: String, trim: true, required: true, lowercase: true }
});

schema.pre('remove', function (doc) {
	console.log('doctors - post - remove');
	Creds.remove({email:doc.email}).exec();

	Patients.find({doctor:doc.email}, function (relative_patients) {
		var all = [];
		for (var patient in relative_patients) {
			all.push(Patients.update(
								{email:relative_patients[patient].email},
								{$set:{doctor:null}}));
		}
		q.all(all).then(function () {});
	});
});

module.exports = mongoose.model('Doctors', schema);