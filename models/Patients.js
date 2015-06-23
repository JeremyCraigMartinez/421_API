var mongoose = require('mongoose');
var validEmail = require('../helpers/validate/email');
var validAge = require('../helpers/validate/age');
var validDoctor = require('../helpers/validate/doctor');
var validWeight = require('../helpers/validate/weight');
var validHeight = require('../helpers/validate/height');
var validName = require('../helpers/validate/name');
var validSex = require('../helpers/validate/sex');

var schema = mongoose.Schema({
	email: { type: String, trim: true, unique: true, required: true, ref: 'Creds', validate: [validEmail, "invalid email"] },
	doctor: { type: String, trim: true, required: true, ref: 'Doctors', validate: [validDoctor, "invalid doctor"] },
	group: [{ type: String, time: true, lowercase: true, ref: 'Groups' }],
	first_name: { type: String, trim: true, required: true, lowercase: true, validate: [validName, "invalid first name"] },
	last_name: { type: String, trim: true, required: true, lowercase: true, validate: [validName, "invalid last name"] },
	age: { type: Number, required: true, validate: [validAge, "invalid age"] },
	height: { type: Number, required: true, validate: [validHeight, "invalid height"] },
	weight: { type: Number, required: true, validate: [validWeight, "invalid weight"] },
	sex: { type: String, lowercase: true, trim: true, validate: [validSex, "invalid sex"] },
});

schema.pre('save', function (next, req) {
	var Doctors = mongoose.model('Doctors');
	var Creds = mongoose.model('Creds');
	var Groups = mongoose.model('Groups');

	Doctors.findOne({email:req.body.doctor}, function (err, found) {
		if (err) return next(new Error(err));
		if (!found) return next(new Error({Error: "not found"}));
		
		var creds = { email: req.body['email'] };
		creds.password = req.body['pass'];
		creds.admin = false;
		var new_creds = new Creds(creds);
		new_creds.save(function (err, inserted) {
			if (err) return next(new Error(err));

			var all = []
			var groups = req.body.groups;

			if (typeof groups === "string") {
				group = groups.toLowerCase();
				Groups.find({_id:group}, function (err, group_id) {
					if (err) next(new Error(err));

					if (!group_id) return next(new Error({Error: "not found"}));
					return next();
				});			
			}
			else {
				Groups.find(function (err, data) {
					if (err) next(new Error(err));

					for (var key in data) {
						all.push(data[key]._id)
					}
					for (var g in groups) {
						if (all.indexOf(groups[g].toLowerCase()) === -1) {
							return next(new Error({Error: "not found"}));
						}
					}
					return next();
				});
			}

		});
	});
});

schema.post('remove', function (patient, done) {
	var Creds = mongoose.model('Creds');

	Creds.remove({email:patient.email}).exec();
	done();
});

module.exports = mongoose.model('Patients', schema);