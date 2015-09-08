var mongoose = require('mongoose');
var Patients = require('../models/Patients');
var Data = require('../models/Data');
var passport = require('passport');

var cleanString = require('../helpers/cleanString');

var authController = require('../helpers/auth');

module.exports = function (app) {
	// get all data entries from requesting patient
	app.get('/data', authController.isPatient, function (req, res, next) {
		Data.find({ email: req.user.email }, function (err, data) {
			if (err) return next(err);
			if (!data) return invalid(res);

			return res.json(data);
		});
	});

	// get specific data entry at :timestamp from requesting patient
	app.get('/data/:timestamp', authController.isPatient, function (req, res, next) {
		Data.findOne({ email: req.user.email, created: req.params.timestamp }, function (err, data) {
			if (err) return next(err);
			if (!data) return invalid(res);

			return res.json(data);
		});
	});

	// delete all data entries from requesting patient
	app.delete('/data/:timestamp', authController.isPatient, function (req, res, next) {
		Raw_Data.findOne({ created: req.params.timestamp, email: req.user.email }, function (err, found) {
			if (err) return next(err);

			found.remove();
			return res.json(found);
		});
	});
}