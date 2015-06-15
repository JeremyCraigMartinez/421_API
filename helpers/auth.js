var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/Creds');
var Patient = require('../models/Patients');
var Doctor = require('../models/Doctors');

passport.use('isUser',new BasicStrategy(
	function (email, password, callback) {
		User.findOne({email:email}, function (err, user) {
			if (err) {return callback(err); }

			// No user found with this email
			if (!user) { return callback(null, false); }

			user.verifyPassword(password, function (err, isMatch) {
				if (err) { return callback(err); }

				// Password did not match
				if (!isMatch) { return callback(null, false); }

				// Success!
				return callback(null, user);
			});
		});
	}
));

passport.use('isPatient',new BasicStrategy(
	function (email, password, callback) {
		User.findOne({email:email}, function (err, user) {
			if (err) {return callback(err); }

			// No user found with this email
			if (!user) { return callback(null, false); }

			user.verifyPassword(password, function (err, isMatch) {
				if (err) { return callback(err); }

				// Password did not match
				if (!isMatch) { return callback(null, false); }

				Patient.findOne({email:email}, function (err, patient) {
					if (err) {return callback(err); }

					// No patient found with this email
					if (!patient) { return callback(null, false); }

					// Success!
					return callback(null, patient);
				})
			});
		});
	}
));

passport.use('isDoctor',new BasicStrategy(
	function (email, password, callback) {
		User.findOne({email:email}, function (err, user) {
			if (err) {return callback(err); }

			// No user found with this email
			if (!user) { return callback(null, false); }

			user.verifyPassword(password, function (err, isMatch) {
				if (err) { return callback(err); }

				// Password did not match
				if (!isMatch) { return callback(null, false); }

				Doctor.findOne({email:email}, function (err, doctor) {
					if (err) {return callback(err); }

					// No doctor found with this email
					if (!doctor) { return callback(null, false); }

					// Success!
					return callback(null, doctor);
				})
			});
		});
	}
));

exports.isUser = passport.authenticate('isUser', {session : false});
exports.isPatient = passport.authenticate('isPatient', {session : false});
exports.isDoctor = passport.authenticate('isDoctor', {session : false});
