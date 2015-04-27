var Groups = require('../../models/Groups');
var q = require('q');

module.exports = function (group) {
	var deferred = q.defer();
	group = group.toLowerCase();
  Groups.findById(group, function (err, group_id) {
  	if (err) console.log(err);

  	if (!group_id) deferred.resolve(false);
	  else deferred.resolve(true);
  });
  return deferred.promise;
}