var mongoose = require('mongoose');
var User_pass = require('../models/User_pass');
var User_info = require('../models/User_info');

var cleanString = require('../helpers/cleanString');
var hash = require('../helpers/hash');
var crypto = require('crypto');

module.exports = function (app) {
	app.get('/user', function (req, res, next) {
		User_pass.find(function (err, users) {
			if (err) return next(err);
			if (!users) return invalid();

			var user_ids = [];
			for (user in users) {
				user_ids.push(users[user]._id);
			}
			return res.json(user_ids);
		});
	});

	app.get('/user/:id', function (req, res, next) {
		var email = cleanString(req.body['email']).toLowerCase();

		User_pass.findById(email, function (err, user) {
			if (err) return next(err);

			if (!user) return invalid();

			return res.json(user);
		});
	});

	app.post('/user/create', function (req, res, next) {
		var email = cleanString(req.body['email']).toLowerCase();
		var pass = cleanString(req.body['pass']);
		if (!(email && pass)) return invalid();

		User_pass.findById(email, function (err, user) {
			if (err) return next(err);

			if (user) return res.send(401, "already exists");
			
			crypto.randomBytes(16, function (err, bytes) {
				if (err) return next(err);

				var user = {_id: email };
				user.salt = bytes.toString('utf8');
				user.hash = hash(pass, user.salt);

				User_pass.create(user, function (err, newUser) {
					if (err) {
						if (err instanceof mongoose.Error.ValidationError) {
							return invalid();
						}
						return next(err);
					}

					console.log('created user: %s', email);
					return res.end();
				});
			});			
		});
		function invalid() {
			res.redirect('/');
		}
	});
}