var validEmail = require('./email');
var validGroup = require('./group');
var validAge = require('./age');
var validDoctor = require('./doctor');
var validWeight = require('./weight');
var validHeight = require('./height');
var validName = require('./name');
var validSex = require('./sex');

var q = require('q');

module.exports = function () {
	var validJSON = {
		_id: validEmail,
		group: validGroup,
		doctor: validDoctor,
		first_name: validName,
		last_name: validName,
		age: validAge,
		height: validWeight,
		weight: validHeight,
		sex: validSex,
		specialty: validName,
		hospital: validName
	}	
	return {
		is_valid: function (obj) {
			var deferred = q.defer();
			var error_msg = [];
			var fields = [];
			var promises = [];
			for (field in obj) {
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
						error_msg.push("Incorrect entry. "+fields[i].val+" is not a valid entry for "+fields[i].key);
					}
				}
				deferred.resolve(error_msg);
			});
			return deferred.promise;
		}
	}
}