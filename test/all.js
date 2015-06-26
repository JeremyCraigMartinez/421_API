'use strict';

var mongoose = require('mongoose');

before(function (done) {
  mongoose.connection.on('mongodb://localhost/m3', done);
});

after(function (done) {
  mongoose.connection.close();
	done();
});
