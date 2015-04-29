var Doctors = require('../../models/Doctors');
var q = require('q');

module.exports = function (doctor) {
	var deferred = q.defer();
  Doctors.findById(doctor, function (err, doctor_id) {
  	if (err) console.log(err);

  	if (!doctor_id) deferred.resolve(false);
	  else deferred.resolve(true);
  });
  return deferred.promise;
}