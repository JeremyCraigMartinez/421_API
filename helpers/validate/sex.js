var q = require('q');

module.exports = function (sex) {
	var deferred = q.defer();
  var re = /(male|female)/i;
  deferred.resolve(re.test(sex));
  return deferred.promise;
}