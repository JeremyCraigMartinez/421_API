var mongoose = require('mongoose');
var Creds = require('../models/Creds');
var Doctors = require('../models/Doctors');
var Patients = require('../models/Patients');
var Groups = require('../models/Groups');
var Diets = require('../models/Diets');

var cleanString = require('../helpers/cleanString');
var hash = require('../helpers/hash');
var crypto = require('crypto');

var authController = require('../helpers/auth');

module.exports = function (app) {
	app.get('/patients', authController.isPatient, function (req, res, next) {
		Patients.findOne({email:req.user.email}, function (err, patient) {
			if (err) return next(err);
			if (!patient) return invalid(res);

			return res.json(patient);
		});
	});

	app.get('/list_of_patients', authController.isDoctor, function (req, res, next) {
		Patients.find({doctor:req.user.email}, function (err, patients) {
			if (err) return next(err);
			if (!patients) return invalid(res);

			var patient_emails = [];
			for (patient in patients) {
				patient_emails.push(patients[patient].email);
			}
			return res.json(patient_emails);
		});
	});

	//must be self inquery or correct doctor
	app.get('/patients/:patient_email', authController.isDoctor, function (req, res, next) {
		var patient_email = cleanString(req.params['patient_email']).toLowerCase();

		Patients.findOne({email:patient_email}, function (err, patient) {
			if (err) return next(err);

			if (!patient) return res.status(400).send('no patient: '+patient_email);

			return res.json(patient);
		});
	});

	app.post('/patients', function (req, res, next) {
		var new_patient = {
			email:      req.body['email'],
			group:      req.body['group'],
			doctor:     req.body['doctor'],
			first_name: req.body['first_name'],
			last_name:  req.body['last_name'],
			age:        req.body['age'],
			height:     req.body['height'],
			weight:     req.body['weight'],
			sex:        req.body['sex']
		}

		var patient = new Patients(new_patient);
		patient.save(req, function (err, inserted) {
			if (err) {
				if (err instanceof mongoose.Error.ValidationError) {
					return res.json(err.errors);
				}
				return next(err);
			}
			return res.status(201).send(inserted);
		});
	});

	//update sensitive information
	//copy entry in "patients" table
	//delete entry in "patients" and "creds" table
	//create
	app.put('/patients/update_account', authController.isUser, function (req, res, next) {
		Patients.findOneAndUpdate(
			{email:req.user["email"]},
			{$set: req.body},
			{},
			function (err, object) {
				if (err) next(err);
				Creds.findOne({email:req.user["email"]}, function (err, object) {
					object['email'] = (req.body['email']) ? req.body['email'] : object['email'];
					object['password'] = (req.body['pass']) ? req.body['pass'] : object['password'];
					object.save(function (err) {
						if (err) return next(err);

						// if user changes email, update all corresponding diet entries
						if (req.user["email"] != req.body["email"]) {
							Diets.find({email:req.user['email']}, function (err, diets) {
								if (err) return next(err);

								for (var each in diets) {
									diets[each].email = req.body['email'];
									diets[each].save();
								}
								return res.json(object);
							});
						}
						else {
							return res.json(object);
						}
					});
				});
			});
	});

	//update non sensitive information
	app.put('/patients/update_info', authController.isUser, function (req, res, next) {
		Patients.findOneAndUpdate(
			{email:req.user["email"]},
			{$set: req.body},
			{},
			function (err, object, t) {
				if (err) next(err);
				return res.json(object);
			});
	});

	app.delete('/patients/remove', authController.isUser, function (req, res, next) {
    var email = req.user['email'];
    Patients.findOne({email:email}, function (err, patient) {
      if (err) return next(err);

      patient.remove().then(function (removed) {
				return res.status(200).send(removed);
			});
		});
	});
}