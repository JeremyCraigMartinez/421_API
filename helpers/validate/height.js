var q = require('q');

//height in inches
module.exports = function (height) {
	//var deferred = q.defer();
  var re = /\d+/;
  //deferred.resolve(re.test(height));
  return re.test(height);
  //return deferred.promise;
}