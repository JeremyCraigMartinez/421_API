var mongoose = require('mongoose');
var validEmail = require('../helpers/validate/email');
var Patients = require('../models/Patients');

var schema = mongoose.Schema({
	_id: { type: String, trim: true, required: true, lowercase: true }
});

schema.post('remove', function (group, done) {
	Patients.update({group:group._id}, {$pull:{group:group._id}}, {multi:true}, function (err, removed) {
		done();
	});
});

module.exports = mongoose.model('Groups', schema);