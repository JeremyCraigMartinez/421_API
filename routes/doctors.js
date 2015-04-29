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
	app.get('/doctors', function (req, res, next) {
		Doctors.find(function (err, doctors) {
			if (err) return next(err);
			if (!doctors) return invalid(res);

			var doctor_ids = [];
			for (doctor in doctors) {
				doctor_ids.push(doctors[doctor]._id);
			}
			return res.json(doctor_ids);
		});
	});

	app.get('/doctors/:doctor_id', function (req, res, next) {
		var doctor_id = cleanString(req.params['doctor_id']).toLowerCase();

		Doctors.findById(doctor_id, function (err, doctor) {
			if (err) return next(err);

			if (!doctor) return res.status(400).send('no doctor: '+doctor_id);

			return res.json(doctor);
		});
	});

	app.post('/doctors', function (req, res, next) {
		var new_doctor = {
			_id:       req.body['_id'],
			first_name: req.body['first_name'],
			last_name: req.body['last_name'],
			specialty: req.body['specialty'],
			hospital:  req.body['hospital']
		}

		validate.is_valid(new_doctor).then(function (error_msg) {
			if (error_msg.length > 0) return res.status(400).send(error_msg);

			//check if someone with this email already has an account
			Creds.findById(req.body['_id'], function (err, doctor) {
				if (err) return next(err);
				if (doctor) return res.status(400).send('doctor already exists. If you want to update, send post to /doctors/update');

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

						//insert row into Doctors table
						Doctors.create(new_doctor, function (err, inserted) {
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

	app.post('/doctors/update', function (req, res, next) {
		var updated_doctor = {};
		for (key in req.body) {
			updated_doctor[key] = req.body[key];
		}
		delete updated_doctor['pass'];

		validate.is_valid(updated_doctor).then(function (error_msg) {
			return res.json({"err":error_msg});
		});
	});

	app.post('/doctors/remove', function (req, res, next) {
		var _id = req.body['_id'];
		Doctors.findByIdAndRemove(_id, function (err, removed) {
			if (err) console.log('no doctor found with that id. checking credentials table');
			Creds.findByIdAndRemove(_id, function (err, removed) {
				if (err) return res.status(400).send(err);
				return res.status(200).send('group '+_id+' was deleted');
			});
		});
	});
}