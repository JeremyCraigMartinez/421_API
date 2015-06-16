module.exports = function (doctor) {
	var mongoose = require('mongoose');

	var Doctors = mongoose.model('Doctors');

	Doctors.findOne({email:doctor}, function (err, found) {
		return (found) ? true : false;
	});
}