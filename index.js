var express = require('express');
var fs = require('fs');
var app = express();
var passport = require('passport');
var bodyParser = require('body-parser');

app.use(bodyParser());
/* server deployment */
/*
var https = require('https');
var options = {
  key: fs.readFileSync('ssl/server.key'),
  cert: fs.readFileSync('ssl/server.crt'),
  ca: fs.readFileSync('ssl/ca.crt'),
  requestCert: false,
  rejectUnauthorized: false
};
var secureServer = https.createServer(options, app).listen('5024', function(){
  //console.log("Secure Express server listening on port 5024");
});
/* end server deployment */

var http = require('http');
var http = require('http').Server(app);
http.listen('5024');

/* API calls */
app.get('/',function(req,res,next){
  obj = {
    username: username,
    password: password,
    doctor: doctor
  }
  res.end(obj);
});

app.get('/login', function(req,res,next){
  res.end('you need to send a POST request to receive an OAuth2 access token');
});

var username;
var password;
var doctor;
app.post('/signup', function(req,res,next){
  obj = req.body;//JSON.parse(req.body);
  console.log(obj);
  username = obj['username'];
  password = obj['password'];
  doctor = obj['doctor'];
  res.end('thank you');
});
