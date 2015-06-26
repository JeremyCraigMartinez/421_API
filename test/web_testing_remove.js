'use strict';

var request = require('supertest');
var mongoose = require('mongoose');
var expect = require("chai").expect;
var S = require("string");

var app = require('../middleware/express');

// import doctors
var house = require('./doctors/house.json');
var lipschitz = require('./doctors/lipschitz.json');

// import patients
var jeremy = require('./patients/jeremy.json');
var barrack = require('./patients/barrack.json');
var oprah = require('./patients/oprah.json');
var marisa = require('./patients/marisa.json');
var michelle = require('./patients/michelle.json');
var samuel = require('./patients/samuel.json');

// import groups
var type_i_diabetes = require('./groups/type_i_diabetes');
var type_ii_diabetes = require('./groups/type_ii_diabetes');
var cancer = require('./groups/cancer');

before(function (done) {
  mongoose.connect('mongodb://localhost/m3', function (err) {
    if (err) console.log(err);
    done();
  });
});

after(function (done) {
  mongoose.connection.close();
  done();
});

describe('PATIENT TEST', function(){
  // removes group
  it('/groups/remove/:groupid - DELETE', function(done){
    request(app)
      .del('/groups/remove/'+type_i_diabetes["_id"])
      .auth(lipschitz["email"], lipschitz["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/groups/remove/:groupid - DELETE', function(done){
    request(app)
      .del('/groups/remove/'+type_ii_diabetes["_id"])
      .auth(lipschitz["email"], lipschitz["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/groups/remove/:groupid - DELETE', function(done){
    request(app)
      .del('/groups/remove/'+cancer["_id"])
      .auth(lipschitz["email"], lipschitz["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });

  // remove doctor
  it('/doctors/remove - DELETE', function (done){
    request(app)
      .del('/doctors/remove')
      .auth(lipschitz["email"], lipschitz["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/doctors/remove - DELETE', function (done){
    request(app)
      .del('/doctors/remove')
      .auth(house["email"], house["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });

  // remove patients
  it('/patients/remove - DELETE', function (done){
    request(app)
      .del('/patients/remove')
      .auth(jeremy['email'], jeremy["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/patients/remove - DELETE', function (done){
    request(app)
      .del('/patients/remove')
      .auth(barrack['email'], barrack["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/patients/remove - DELETE', function (done){
    request(app)
      .del('/patients/remove')
      .auth(oprah['email'], oprah["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/patients/remove - DELETE', function (done){
    request(app)
      .del('/patients/remove')
      .auth(marisa['email'], marisa["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/patients/remove - DELETE', function (done){
    request(app)
      .del('/patients/remove')
      .auth(michelle['email'], michelle["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/patients/remove - DELETE', function (done){
    request(app)
      .del('/patients/remove')
      .auth(samuel['email'], samuel["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
});