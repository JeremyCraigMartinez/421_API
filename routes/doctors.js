var mongoose = require('mongoose');
var Creds = require('../models/Creds');
var Doctors = require('../models/Doctors');
var Patients = require('../models/Patients');
var Groups = require('../models/Groups');

var cleanString = require('../helpers/cleanString');
var hash = require('../helpers/hash');
var crypto = require('crypto');
var q = require('q');

var authController = require('../helpers/auth');

module.exports = function (app) {
	app.get('/doctors', function (req, res, next) {
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

	app.get('/doctors/:doctor_email', function (req, res, next) {
		var doctor_email = cleanString(req.params['doctor_email']).toLowerCase();

		Doctors.findOne({email:doctor_email}, function (err, doctor) {
			if (err) return next(err);

			if (!doctor) return res.status(400).send('no doctor: '+doctor_email);

			return res.json(doctor);
		});
	});

	app.post('/doctors', function (req, res, next) {
		var new_doctor = {
			email:      req.body['email'],
			first_name: req.body['first_name'],
			last_name:  req.body['last_name'],
			specialty:  req.body['specialty'],
			hospital:   req.body['hospital']
		}
		var new_doc = new Doctors(new_doctor);
		new_doc.save(req, function (err, inserted) {
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
	//copy entry in "doctors" table
	//delete entry in "doctors" and "creds" table
	//create
	app.put('/doctors/update_account', authController.isDoctor, function (req, res, next) {
		Doctors.findOneAndUpdate(
			{email:req.user["email"]},
			{$set: req.body},
			{runValidators:true},
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
	app.put('/doctors/update_info', authController.isDoctor, function (req, res, next) {
		Doctors.findOneAndUpdate(
			{email:req.user["email"]},
			{$set: req.body},
			{runValidators:true},
			function (err, object, t) {
				if (err) next(err);
				return res.json(object);
			});
	});

	app.delete('/doctors/remove', authController.isDoctor, function (req, res, next) {
		var email = req.user['email'];
		Doctors.findOne({email:email}, function (err, doc) {
			if (err) return next(err);

			doc.remove().then(function (removed) {
				return res.status(200).send(removed);				
			});
		});
	});
}