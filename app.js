var mongoose = require('mongoose');
var app = require('./middleware/express');

mongoose.connect('mongodb://localhost/m3', function(err) {
	if (err) throw err;
	console.log('connected');

	app.listen(5025, function() {
		console.log('now listen on localhost:5025');
	});
});