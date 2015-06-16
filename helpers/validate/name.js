var q = require('q');

module.exports = function (name) {
	//var deferred = q.defer();
  var re = /^[A-z ]+$/;
  //deferred.resolve(re.test(name));
  return re.test(name);
  //return deferred.promise;
}