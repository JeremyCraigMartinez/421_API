var errors = require('./errors');
var patients = require('./patients');
var groups = require('./groups');
var doctors = require('./doctors');

var mongoose = require('mongoose');

module.exports = function(app) {

	patients(app);
	groups(app);
	doctors(app);

	errors(app);
}