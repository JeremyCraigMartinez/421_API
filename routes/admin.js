var mongoose = require('mongoose');
var Creds = require('../models/Creds');
var Doctors = require('../models/Doctors');
var Patients = require('../models/Patients');
var Diets = require('../models/Diets');
var Groups = require('../models/Groups');

var cleanString = require('../helpers/cleanString');
var hash = require('../helpers/hash');
var crypto = require('crypto');
var q = require('q');

var authController = require('../helpers/auth');

module.exports = function (app) {
	app.get('/admin/patients', authController.isAdmin, function (req, res, next) {
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

	app.put('/admin/doctors/update_account/:doctor', authController.isAdmin, function (req, res, next) {
		Doctors.findOneAndUpdate(
			{email:req.params["doctor"]},
			{$set: req.body},
			{runValidators:true},
			function (err, object) {
				if (err) return next(err);
				Creds.findOne({email:req.params["doctor"]}, function (err, object) {
					object['email'] = (req.body['email']) ? req.body['email'] : object['email'];
					object['password'] = (req.body['pass']) ? req.body['pass'] : object['password'];
					object.save(function (err) {
						return res.json(object);
					});
				});
			});
	});

	//update non sensitive information
	app.put('/admin/doctors/update_info/:doctor', authController.isAdmin, function (req, res, next) {
		//if user is trying to change email here
		if (req.body['email'] != undefined && req.params["doctor"] != req.body['email']) {
			return res.status(400).json({"error":"cannot change email through this api call. Please use /admin/doctors/update_account/:doctor or /doctors/update_account/"});
		}
		Doctors.findOneAndUpdate(
			{email:req.params["doctor"]},
			{$set: req.body},
			{runValidators:true},
			function (err, object, t) {
				if (err) next(err);
				return res.json(object);
			});
	});

	app.put('/admin/patients/update_account/:patient', authController.isAdmin, function (req, res, next) {
		Patients.findOneAndUpdate(
			{email:req.params["patient"]},
			{$set: req.body},
			{runValidators:true},
			function (err, object) {
				if (err) next(err);
				Creds.findOne({email:req.params["patient"]}, function (err, creds) {
					creds['email'] = (req.body['email']) ? req.body['email'] : creds['email'];
					creds['password'] = (req.body['pass']) ? req.body['pass'] : creds['password'];
					creds.save(function (err) {
						if (err) return next(err);

						// if user changes email, update all corresponding diet entries
						if (req.params["patient"] != req.body["email"]) {
							Diets.find({email:req.params['patient']}, function (err, diets) {
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
	app.put('/admin/patients/update_info/:patient', authController.isAdmin, function (req, res, next) {
		//if user is trying to change email here
		if (req.body['email'] != undefined && req.params["patient"] != req.body['email']) {
			return res.status(400).json({"error":"cannot change email through this api call. Please use /admin/doctors/update_account/:doctor or /doctors/update_account/"});
		}
		Patients.findOneAndUpdate(
			{email:req.params["patient"]},
			{$set: req.body},
			{runValidators:true},
			function (err, object, t) {
				if (err) next(err);
				return res.json(object);
			});
	});

	app.delete('/admin/doctors/remove/:doctor', authController.isAdmin, function (req, res, next) {
		var email = req.params['doctor'];
		Doctors.findOne({email:email}, function (err, doc) {
			if (err) return next(err);

			doc.remove().then(function (removed) {
				return res.status(200).send(removed);				
			});
		});
	});

	app.delete('/admin/patients/remove/:patient', authController.isAdmin, function (req, res, next) {
    var email = req.params['patient'];
    Patients.findOne({email:email}, function (err, patient) {
      if (err) return next(err);

      patient.remove().then(function (removed) {
				return res.status(200).send(removed);
			});
		});
	});

	app.delete('/admin/diet/remove/:patient/:timestamp', authController.isAdmin, function (req, res, next) {
    Diets.findOne({email:req.params['patient'],created:req.params.timestamp}, function (err, diet) {
      if (err) return next(err);

      diet.remove().then(function (removed) {
				return res.status(200).send(removed);
			});
		});
	});

	//all diet entries
	app.get('/admin/diet/:patient_email', authController.isAdmin, function (req, res, next) {
		Patients.findOne({email:req.params.patient_email}, function (err, patient) {
			if (err) return next(err);
			if (!patient) return res.status(401).send({error:"no patient by that email"});

			Diets.find({email:patient.email}, function (err, diet_entries) {
				if (err) return next(err);
				if (!diet_entries) return res.json({error:"there are no diet entries for "+patient.first_name+" "+patient.last_name});

				res.json(diet_entries);
			});
		});
	});

	//specific diet entry based on timestamp
	app.get('/admin/diet/:patient_email/:timestamp', authController.isAdmin, function (req, res, next) {
		Patients.findOne({email:req.params.patient_email}, function (err, patient) {
			if (err) return next(err);
			if (!patient) return res.status(401).send({error:"no patient by that email"});

			Diets.findOne({email:patient.email,created:req.params.timestamp}, function (err, diet_entry) {
				if (err) return next(err);
				if (!diet_entry) return res.json({error:"there are no diet entries for "+patient.first_name+" "+patient.last_name});

				res.json(diet_entry);
			});
		});
	});
}