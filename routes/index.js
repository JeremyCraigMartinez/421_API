var errors = require('./errors');
var user = require('./user');
var mongoose = require('mongoose');

module.exports = function(app) {

	user(app);

	errors(app);
}