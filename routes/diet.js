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
	app.get('/diet', authController.isAuthenticated, function (req, res, next) {
		
	});
}