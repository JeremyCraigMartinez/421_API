var q = require('q');

module.exports = function (email) {
	var deferred = q.defer();
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  deferred.resolve(re.test(email));
  return deferred.promise;
}