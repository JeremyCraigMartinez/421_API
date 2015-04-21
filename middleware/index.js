var express = require('express');
var morgan = require('morgan');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var cors = require('cors')

module.exports = function (app) {
	// create a write stream (in append mode)
	var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})

	app.use(cors());

	// setup the logger
	app.use(morgan('dev', {stream: accessLogStream}))

	app.use(cookieParser());
	app.use(session({ secret: 'building a blog'}));

	app.use(bodyParser());

	app.use(function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.locals.session = req.session;
		next();
	});
}