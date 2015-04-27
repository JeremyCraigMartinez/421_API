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
			if (!users) return invalid(res);

			var user_ids = [];
			for (user in users) {
				user_ids.push(users[user]._id);
			}
			return res.json(user_ids);
		});
	});

	var invalid = function (res) {
		res.redirect('/');
	}

	app.get('/user/:id', function (req, res, next) {
		var id = cleanString(req.params['id']).toLowerCase();

		User_info.findById(id, function (err, user) {
			if (err) return next(err);

			if (!user) return res.status(404).send('no user: '+id);

			return res.json(user);
		});
	});

	app.post('/user/create', function (req, res, next) {
		console.log(req.body);
		
		var email = req.body['email'];
		var pass = req.body['pass'];

		if (!(email && pass)) return invalid(res);

		User_pass.findById(email, function (err, user) {
			if (err) {
				return next(err);
			}

			if (user) return res.send(401, "already exists");
			
			crypto.randomBytes(16, function (err, bytes) {
				if (err) return next(err);

				var user = {_id: email };
				user.salt = bytes.toString('utf8');
				user.hash = hash(pass, user.salt);

				User_pass.create(user, function (err, newUser) {
					if (err) {
						if (err instanceof mongoose.Error.ValidationError) {
							return res.json(err.errors);
						}
						return next(err);
					}

					console.log('created user: %s', email);
					return res.end();
				});
			});			
		});
	});

	app.post('/user/:email/info', function (req, res, next) {
		console.log('asdf');

		var group = req.body['group'];
		var first_name = cleanString(req.body['first_name']);
		var last_name = cleanString(req.body['last_name']);
		var age = cleanString(req.body['age']);
		var height = cleanString(req.body['height']);
		var weight = cleanString(req.body['weight']);
		var sex = cleanString(req.body['sex']);
		var email = cleanString(req.params['email']).toLowerCase();
		
		if (!email) return invalid(res);


		User_pass.findById(email, function (err, user) {
			if (err) return next(err);

			if (!user) return res.end("User does not exist");
			
			var user = {_id: email };
			user.group = group;
			user.first_name = first_name;
			user.last_name = last_name;
			user.age = age;
			user.height = height;
			user.weight = weight;
			user.sex = sex;
//{_id:email}, user, {upsert:true},
			User_info.update({_id:email}, user, {upsert:true,runValidators:true}, function (err, newUser) {
				if (err) {
					if (err instanceof mongoose.Error.ValidationError) {
						return res.json(err.errors);
					}
					return next(err);
				}

				console.log('created user: %s', email);
				return res.end();
			});			
		});
	});	

	app.post('/login', function (req, res, next) {
		res.json({"token":"78ha87382oidh"});
	});
}
