var mongoose = require('mongoose');
var Groups = require('../models/Groups');

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
			if (group) return res.status(200).send("group already exists");

			Groups.create(req.body, function (err, inserted) {
				if (err) {
					if (err instanceof mongoose.Error.ValidationError) {
						return res.json(err.errors);
					}
					return next(err);
				}
				res.end();
			})
		});
	});

	app.post('/groups/remove', function (req, res, next) {
		var _id = req.body['_id'].toLowerCase();

		console.log(_id);

		Groups.findByIdAndRemove(_id, function (err, removed) {
			if (err) return res.status(200).send("err");
			return res.status(200).send('group '+_id+' was deleted');
		});
	});
}