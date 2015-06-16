var q = require('q');

//weight in pounds
module.exports = function (weight) {
	//var deferred = q.defer();
  var re = /\d+/;
  //deferred.resolve(re.test(weight));
  return re.test(weight);
  //return deferred.promise;
}