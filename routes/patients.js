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

			var patient_ids = [];
			for (patient in patients) {
				patient_ids.push(patients[patient]._id);
			}
			return res.json(patient_ids);
		});
	});

	app.get('/patients/:patient_id', function (req, res, next) {
		var patient_id = cleanString(req.params['patient_id']).toLowerCase();

		Patients.findById(patient_id, function (err, patient) {
			if (err) return next(err);

			if (!patient) return res.status(400).send('no patient: '+patient_id);

			return res.json(patient);
		});
	});

	app.post('/patients', function (req, res, next) {
		var new_patient = {
			_id:        req.body['_id'],
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
			Creds.findById(req.body['_id'], function (err, patient) {
				if (err) return next(err);
				if (patient) return res.status(400).send('patient already exists. If you want to update, send post to /patients/update');

				//encrypt password
				crypto.randomBytes(16, function (err, bytes) {
					if (err) return next(err);

					var new_creds = { _id: req.body['_id'] };
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
							return res.status(201).send('inserted '+inserted);
						});
					});
				});			
			});
		});
	});

	app.post('/patients/update', function (req, res, next) {
		var updated_patient = {};
		for (key in req.body) {
			updated_patient[key] = req.body[key];
		}
		delete updated_patient['pass'];

		validate.is_valid(updated_patient).then(function (error_msg) {
			console.log(error_msg);
		});
	});
}