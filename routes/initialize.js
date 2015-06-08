var Doctors = require('../models/Doctors');
var Patients = require('../models/Patients');
var Creds = require('../models/Creds');

var authController = require('../helpers/auth');

module.exports = function (app) {
	app.post('/auth', function (req, res, next) {
		var email = req.body.email;
		var password = req.body.password;

		Creds.findOne({email:email}, function (err, user) {
			if (err) return next(err);

			// No user found with this email
			if (!user) return res.status(404).send("User "+email+" not found");

			user.verifyPassword(password, function (err, isMatch) {
				// Password did not match
				if (!isMatch) return res.status(401).send("Incorrect Password");

				if (err) return next(err);

				// Success!
				return res.status(200).end();
			});
		});
	});
}