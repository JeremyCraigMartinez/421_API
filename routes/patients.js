var mongoose = require('mongoose');
var Creds = require('../models/Creds');
var Doctors = require('../models/Doctors');
var Patients = require('../models/Patients');
var Groups = require('../models/Groups');

var cleanString = require('../helpers/cleanString');
var hash = require('../helpers/hash');
var crypto = require('crypto');
var validate = require('../helpers/validate')();

module.exports = function (app) {
	app.get('/patients', function (req, res, next) {
		Patients.find(function (err, patients) {
			if (err) return next(err);
			if (!patients) return invalid(res);

			var patient_emails = [];
			for (patient in patients) {
				patient_emails.push(patients[patient].email);
			}
			return res.json(patient_emails);
		});
	});

	app.get('/patients/:patient_email', function (req, res, next) {
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

		validate.is_valid(new_patient).then(function (error_msg) {
			if (error_msg.length > 0) return res.status(400).send(error_msg);

			//check if someone with this email already has an account
			Creds.findOne({email:req.body['email']}, function (err, patient) {
				if (err) return next(err);
				if (patient) return res.json({error:'patient already exists. If you want to update, send post to /patients/update'});

				//encrypt password
				crypto.randomBytes(16, function (err, bytes) {
					if (err) return next(err);

					var new_creds = { email: req.body['email'] };
					new_creds.salt = bytes.toString('utf8');
					new_creds.hash = hash(req.body['pass'], new_creds.salt);

					//insert row into Creds table
					Creds.create(new_creds, function (err, inserted) {
						if (err) {
							if (err instanceof mongoose.Error.ValidationError) {
								return res.json(err.errors);
							}
							return next(err);
						}

						//insert row into Patients table
						Patients.create(new_patient, function (err, inserted) {
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
	});

	//update non sensitive information
	app.post('/patients/update_info', function (req, res, next) {
		Patients.findOneAndUpdate(
			{email:req.body["email"]},
			{$set: req.body},
			{},
			function (err, object, t) {
				if (err) next(err);
				return res.json(object);
			});
	});

	app.post('/patients/remove', function (req, res, next) {
		var email = req.body['email'];
		Patients.findOneAndRemove({email:email}, function (err, removed) {
			if (err) console.log('no doctor found with that id. checking credentials table');
			Creds.findOneAndRemove({email:email}, function (err, removed) {
				if (err) return res.status(400).send(err);
				return res.status(200).send(removed);
			});
		});
	});
}