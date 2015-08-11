var mongoose = require('mongoose');
var validEmail = require('../helpers/validate/email');
var validDate = require('../helpers/validate/date');
var validFood = require('../helpers/validate/name');
var Creds = require('./Creds');
var Patients = require('./Patients');
var http = require('http');
var fs = require('fs');

var schema = mongoose.Schema({
	email: { type: String, trim: true, required: true, ref: 'Patients', validate: [validEmail,"invalid email"] },
	created: { type: String, required: true, validate: [validDate,"invalid date"] },
	food: { type: String, trim: true, required: true },
	foodID: { type: String, required: true },
	calories: { type: Number, required: true },
	quantity: { type: Number, required: true }
});

schema.index({email:1, created:1}, {unique: true});

schema.pre('validate', function (callback, body) {
	var user = this;
	if (user.isModified('foodID')) {
		if (user.food) delete user.food
		if (user.calories) delete user.calories
		var options = {
			host: 'api.nal.usda.gov',
			port: 80,
			path: '/ndb/nutrients/?format=json&api_key=EYSVIZjCLeSX9P1PEahJSWpbWUlimEvF3pJ5DNpG&nutrients=208&ndbno='+this.foodID,
			headers: {
				"Content-Type": 'applications/json'
			}
		}
		var req = http.get(options, function (res) {
			res.setEncoding('utf8');
			res.on('data', function (data) {
				var data = JSON.parse(data);
				user.food = data.report.foods[0].name;
				user.calories = data.report.foods[0].nutrients[0].value * user.quantity

				// enter data into our local database
			});

			res.on('end', function () {
				// get data from local database
				callback();
			});
		});

		req.on('error', function (err) {
			console.log(err);
		});

		req.end();
	}
	else callback();
});

module.exports = mongoose.model('Diets', schema);