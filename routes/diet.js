var mongoose = require('mongoose');
var Creds = require('../models/Creds');
var Doctors = require('../models/Doctors');
var Patients = require('../models/Patients');
var Diet = require('../models/Diet');
var Groups = require('../models/Groups');
var passport = require('passport');

var cleanString = require('../helpers/cleanString');
var hash = require('../helpers/hash');
var crypto = require('crypto');

var authController = require('../helpers/auth');

module.exports = function (app) {
	app.get('/diet', authController.isPatient, function (req, res, next) {
		var email = req.user.email;
		res.json({done:'done'});
	});

	app.post('/diet', authController.isPatient, function (req, res, next) {
		var email = req.user.email;
		res.json({done:'done'});
	});
	
	app.put('/diet/:timestamp', authController.isPatient, function (req, res, next) {
		var email = req.user.email;
		res.json({done:'done'});
	});

	app.delete('/diet/:timestamp', authController.isPatient, function (req, res, next) {
		var email = req.user.email;
		res.json({done:'done'});
	});

	app.get('/diet/:patient_email', authController.isDoctor, function (req, res, next) {
		var email = req.user.email;
		res.json({done:'done'});
	});
}