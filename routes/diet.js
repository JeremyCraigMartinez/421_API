var mongoose = require('mongoose');
var Creds = require('../models/Creds');
var Doctors = require('../models/Doctors');
var Patients = require('../models/Patients');
var Diet = require('../models/Diet');
var Groups = require('../models/Groups');
var passport = require('passport');

var cleanString = require('../helpers/cleanString');

var authController = require('../helpers/auth');

module.exports = function (app) {
	app.get('/diet', authController.isPatient, function (req, res, next) {
		var email = req.user.email;
		Diet.find({email:email}, function (err, diet_entries) {
			if (err) return next(err);
			if (!diet_entries) return next(null);

			res.json(diet_entries);
		});
	});

	app.get('/diet/:timestamp', authController.isPatient, function (req, res, next) {
		var email = req.user.email;
		Diet.findOne({email:email,created:req.params.timestamp}, function (err, diet_entry) {
			if (err) return next(err);
			if (!diet_entry) return next(null);

			res.json(diet_entry);
		});
	});

	app.post('/diet', authController.isPatient, function (req, res, next) {
		new_diet = new Diet(req.body);
		new_diet.save(function (err, inserted) {
			if (err) {
				if (err instanceof mongoose.Error.ValidationError) {
					return res.json(err.errors);
				}
				return next(err);
			}
			return res.json(inserted);			
		});
	});
	
	app.put('/diet/:timestamp', authController.isPatient, function (req, res, next) {
		Diet.findOneAndUpdate(
			{email:req.user.email,created:req.params.timestamp},
			{$set: req.body},
			{},
			function (err, object) {
				if (err) return next(err);
				return res.json(object);
			});
	});

	app.delete('/diet/:timestamp', authController.isPatient, function (req, res, next) {
		Diet.findOne({email:req.user.email,created:req.params.timestamp}, function (err, diet) {
			if (err) return next(err);

			diet.remove().then(function (removed) {
				return res.json(removed);
			});
		});
	});

	//all diet entries
	app.get('/diet/doctor/:patient_email', authController.isDoctor, function (req, res, next) {
		Patients.findOne({email:req.params.patient_email,doctor:req.user.email}, function (err, patient) {
			if (err) return next(err);
			if (!patient) return res.status(401).send({unauthorized:"this patient has not chosen you as their doctor"});

			Diet.find({email:patient.email}, function (err, diet_entries) {
				if (err) return next(err);
				if (!diet_entries) return res.json({error:"there are no diet entries for "+patient.first_name+" "+patient.last_name});

				res.json(diet_entries);
			});
		});
	});

	//specific diet entry based on timestamp
	app.get('/diet/doctor/:patient_email/:timestamp', authController.isDoctor, function (req, res, next) {
		Patients.findOne({email:req.params.patient_email,doctor:req.user.email}, function (err, patient) {
			if (err) return next(err);
			if (!patient) return res.status(401).send({unauthorized:"this patient has not chosen you as their doctor"});

			Diet.findOne({email:patient.email,created:req.params.timestamp}, function (err, diet_entry) {
				if (err) return next(err);
				if (!diet_entry) return res.json({error:"there are no diet entries for "+patient.first_name+" "+patient.last_name});

				res.json(diet_entry);
			});
		});
	});
}