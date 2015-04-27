var errors = require('./errors');
var creds = require('./creds');
var groups = require('./groups');
var doctors = require('./doctors');

var mongoose = require('mongoose');

module.exports = function(app) {

	creds(app);
	groups(app);
	doctors(app);

	errors(app);
}