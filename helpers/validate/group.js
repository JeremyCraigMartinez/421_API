var Groups = require('../../models/Groups');
var q = require('q');

module.exports = function (groups) {
	var deferred = q.defer();
	var all = []

	if (typeof groups === "string") {
		group = groups.toLowerCase();
		Groups.find({_id:group}, function (err, group_id) {
			if (err) deferred.reject(err);

			if (!group_id) deferred.resolve(false);
			else deferred.resolve(true);
		});			
	}
	else {
		Groups.find(function (err, data) {
			if (err) deferred.reject(err);

			for (var key in data) {
				all.push(data[key]._id)
			}
			for (var g in groups) {
				if (all.indexOf(groups[g].toLowerCase()) === -1) {
					deferred.resolve(false);
				}
			}
			deferred.resolve(true);
		});
	}

  return deferred.promise;
}