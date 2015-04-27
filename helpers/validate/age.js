var q = require('q');

module.exports = function (age) {
	var deferred = q.defer();
  var re = /\d+/;
  deferred.resolve(re.test(age) && age<=105);
  return deferred.promise;
}