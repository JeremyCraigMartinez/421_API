var Doctors = require('../../models/Doctors');
var q = require('q');

module.exports = function (email) {
	var deferred = q.defer();
  Doctors.find({email:email}, function (err, doctor) {
  	if (err) console.log(err);

  	if (!doctor) deferred.resolve(false);
	  else deferred.resolve(true);
  });
  return deferred.promise;
}