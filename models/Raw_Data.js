var mongoose = require('mongoose');
var validEmail = require('../helpers/validate/email');
var validDate = require('../helpers/validate/date');
var Data = require('./Data');
var Raw_Data_tmp = require('./Raw_Data_tmp');

var schema = mongoose.Schema({
	email: { type: String, trim: true, required: true, ref: 'Patients', validate: [validEmail,"invalid email"] },
	created: { type: String, required: true, validate: [validDate,"invalid date"] },
	entered: { type: Date, required: true, default: Date() },
	data: { type: String, trim: true, required: true }
});

schema.index({ email: 1, created: 1 }, { unique: true });

schema.post('save', function (doc) {
	var copy = new Raw_Data_tmp(this);
	copy.save(function (err, saved) { 
		//console.log('raw_data_tmp saved');
	});
});

schema.post('remove', function (doc) {
	Raw_Data_tmp.remove({ email:doc.email, created: doc.created }, function (err, saved) {
		//console.log('raw_data_tmp removed');
	});
});

module.exports = mongoose.model('Raw_Data', schema);