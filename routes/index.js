var errors = require('./errors');
var patients = require('./patients');
var groups = require('./groups');
var doctors = require('./doctors');
var diet = require('./diet');
var admin = require('./admin');
var initialize = require('./initialize');

var mongoose = require('mongoose');

module.exports = function(app) {

	patients(app);
	groups(app);
	doctors(app);
	diet(app);
	admin(app);
	initialize(app);

	errors(app);
}