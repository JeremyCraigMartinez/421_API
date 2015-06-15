var mongoose = require('mongoose');
var Groups = require('../models/Groups');
var Patients = require('../models/Patients');

var authController = require('../helpers/auth');

module.exports = function (app) {
	app.get('/groups', function (req, res, next) {
		Groups.find(function (err, groups) {
			if (err) return next(err);
			if (!groups) return invalid(res);

			return res.json(groups);
		});
	});

	app.post('/groups', function (req, res, next) {
		var _id = req.body['_id'];

		Groups.findById(_id, function (err, group) {
			if (err) return next(err);
			if (group) return res.status(200).send({error:"group already exists"});

			Groups.create(req.body, function (err, inserted) {
				if (err) {
					if (err instanceof mongoose.Error.ValidationError) {
						return res.json(err.errors);
					}
					return next(err);
				}
				return res.status(201).send(inserted);
			});
		});
	});

	app.delete('/groups/remove/:groupid', authController.isUser, function (req, res, next) {
		var _id = req.params['groupid'].toLowerCase();

		Groups.findById(_id, function (err, group) {
			if (err) return res.status(400).send(err);

			group.remove().then(function (removed) {
				return res.status(200).send(removed);				
			});
		});
	});
}