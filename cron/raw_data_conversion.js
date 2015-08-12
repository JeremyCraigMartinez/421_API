var Raw_Data = require('../models/Raw_Data');
var Data = require('../models/Data');

var crontab = require('node-crontab');
var Q = require('q');

var global_funcs = {};

global_funcs.convert_data = function () {
	var deferred = Q.defer();
	Raw_Data.find({}, function (err, found_raw_data_entries) {
		var all = [];
		for (var each in found_raw_data_entries) {
			all.push(global_funcs.convert(found_raw_data_entries[each]));
		}
		Q.all(all).then(function (processed_data) {
			global_funcs.enter_processed_data(processed_data).then(function (success) {
				deferred.resolve(success);
			});
		});
	});
	return deferred.promise;
}

global_funcs.convert = function (raw_data_entries) {
	var deferred = Q.defer();
	raw_data_entries['data'] = raw_data_entries['data'] + Date();
	deferred.resolve(raw_data_entries);
	return deferred.promise;
}

global_funcs.enter_processed_data = function (processed_data) {
	var deferred = Q.defer();
	var all = [];
	console.log('checkpoint 4.5');
	for (var each in processed_data) {
		var data = new Data({
			email: processed_data[each].email,
			created: processed_data[each].created,
			data: processed_data[each]['data']			
		});
		all.push(data.save());
	}
	Q.all(all).then(function (success) {
		console.log(success);
		deferred.resolve(success);
	});
	return deferred.promise;
}

module.exports = function() {
	var jobId = crontab.scheduleJob("0 0 * * *", function(){ //This will call this function every 2 minutes 
		console.log('checkpoint 1');
	  global_funcs.convert_data().then(function (success) {
	  	console.log(success);
	  });
	});
}