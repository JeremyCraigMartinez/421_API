var mongoose = require('mongoose');
var Creds = require('../models/Creds');
var Doctors = require('../models/Doctors');
var Patients = require('../models/Patients');
var Groups = require('../models/Groups');

var cleanString = require('../helpers/cleanString');
var hash = require('../helpers/hash');
var crypto = require('crypto');
var validate = require('../helpers/validate')();

var authController = require('../helpers/auth');

module.exports = function (app) {
	app.get('/doctors', authController.isAuthenticated, function (req, res, next) {
		Doctors.find(function (err, doctors) {
			if (err) return next(err);
			if (!doctors) return invalid(res);

			var doctor_emails = [];
			for (doctor in doctors) {
				doctor_emails.push(doctors[doctor].email);
			}
			return res.json(doctor_emails);
		});
	});

	app.get('/doctors/:doctor_email', authController.isAuthenticated, function (req, res, next) {
		var doctor_email = cleanString(req.params['doctor_email']).toLowerCase();

		// Reject request if doctor inquires about any doctors other than themselves
		if (req.user['email'] != req.params['doctor_email']) {
			res.status(401).send('unauthorized');
		}

		Doctors.findOne({email:doctor_email}, function (err, doctor) {
			if (err) return next(err);

			if (!doctor) return res.status(400).send('no doctor: '+doctor_email);

			return res.json(doctor);
		});
	});

	app.post('/doctors', function (req, res, next) {
		var new_doctor = {
			email:       req.body['email'],
			first_name: req.body['first_name'],
			last_name: req.body['last_name'],
			specialty: req.body['specialty'],
			hospital:  req.body['hospital']
		}

		validate.is_valid(new_doctor).then(function (error_msg) {
			if (error_msg.length > 0) return res.status(400).send(error_msg);

			//check if someone with this email already has an account
			Creds.find({email:req.body['email']}, function (err, doctor) {
				if (err) return next(err);
				if (doctor.length) return res.json({error:'doctor already exists. If you want to update, send post to /doctors/update'});

				var new_creds = { email: req.body['email'] };
				new_creds.password = req.body['pass'];

				//insert row into Creds table
				Creds.create(new_creds, function (err, inserted) {
					if (err) {
						if (err instanceof mongoose.Error.ValidationError) {
							return res.json(err.errors);
						}
						return next(err);
					}

					//insert row into Doctors table
					Doctors.create(new_doctor, function (err, inserted) {
						if (err) {
							if (err instanceof mongoose.Error.ValidationError) {
								return res.json(err.errors);
							}
							return next(err);
						}
						return res.status(201).send(inserted);
					});
				});
			});
		});
	});

	//update sensitive information
	//copy entry in "doctors" table
	//delete entry in "doctors" and "creds" table
	//create
	app.put('/doctors/update_account', authController.isAuthenticated, function (req, res, next) {
		Doctors.findOneAndUpdate(
			{email:req.user["email"]},
			{$set: req.body},
			{},
			function (err, object) {
				if (err) next(err);
				Creds.findOne({email:req.user["email"]}, function (err, object) {
					object['email'] = (req.body['email']) ? req.body['email'] : object['email'];
					object['password'] = (req.body['pass']) ? req.body['pass'] : object['password'];
					object.save(function (err) {
						return res.json(object);
					});
				});
			});
	});

	//update non sensitive information
	app.put('/doctors/update_info', authController.isAuthenticated, function (req, res, next) {
		Doctors.findOneAndUpdate(
			{email:req.user["email"]},
			{$set: req.body},
			{},
			function (err, object, t) {
				if (err) next(err);
				return res.json(object);
			});
	});

	app.delete('/doctors/remove', authController.isAuthenticated, function (req, res, next) {
		var email = req.user['email'];
		Doctors.findOneAndRemove({email:email}, function (err, removed) {
			if (err) return next(err);
			Creds.findOneAndRemove({email:email}, function (err, removed) {
				if (err) return next(err);
				return res.status(200).send(removed);
			});
		});
	});
}