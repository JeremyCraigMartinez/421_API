var mongoose = require('mongoose');
var express = require('express');
var routes = require('./routes');
var middleware = require('./middleware');

mongoose.connect('mongodb://localhost/test', function(err) {
	if (err) throw err;
	console.log('connected');

	var app = express();

	middleware(app);
	routes(app);
	app.listen(3000, function() {
		console.log('now listen on localhost:3000');
	});
});