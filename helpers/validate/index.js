var validEmail = require('./email');
var validGroup = require('./group');
var validAge = require('./age');
var validWeight = require('./weight');
var validHeight = require('./height');
var validName = require('./name');
var validSex = require('./sex');

var q = require('q');

module.exports = function () {
	var validJSON = {
		_id: validEmail,
		group: validGroup,
		first_name: validName,
		last_name: validName,
		age: validAge,
		height: validWeight,
		weight: validHeight,
		sex: validSex
	}	
	console.log(validJSON.group);
	return {
		is_valid_patient: function (obj) {
			var deferred = q.defer();
			var error_msg = [];
			var fields = [];
			var promises = [];
			for (field in obj) {
				console.log()
				promises.push(validJSON[field](obj[field], field));
				var tmp = {
					key: field,
					val: obj[field]
				};
				fields.push(tmp);
			}
			q.all(promises).then(function (results) {
				for (var i=0; i<promises.length; i++) {
					if (!results[i]) {
						console.log(fields[i]);
						error_msg.push("Incorrect entry. "+fields[i].val+" is not a valid entry for "+fields[i].key);
					}
				}
				deferred.resolve(error_msg);
			});
			return deferred.promise;
		}
	}
}