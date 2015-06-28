'use strict';

var request = require('supertest');
var mongoose = require('mongoose');
var expect = require("chai").expect;
var S = require("string");
var execSync = require('execSync');

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

describe('WEBSITE TESTING - ENTER ', function(){
  // create doctors
  it('/doctors - POST - (create doctor)', function (done){
    request(app)
      .post('/doctors')
      .send(lipschitz)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('doctor already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(lipschitz['email']);
        execSync.exec('./test/make_admin.sh '+lipschitz.email);
        done();
      });
  });
  it('/doctors - POST - (create doctor)', function (done){
    request(app)
      .post('/doctors')
      .send(house)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('doctor already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(house['email']);
        done();
      });
  });

  // create groups
  it('/groups - POST - (create group)', function (done){
    request(app)
      .post('/groups')
      .auth(lipschitz["email"], lipschitz["pass"])
      .send(type_i_diabetes)
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        done();
      });
  });
  it('/groups - POST - (create group)', function (done){
    request(app)
      .post('/groups')
      .auth(lipschitz["email"], lipschitz["pass"])
      .send(type_ii_diabetes)
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        done();
      });
  });
  it('/groups - POST - (create group)', function (done){
    request(app)
      .post('/groups')
      .auth(lipschitz["email"], lipschitz["pass"])
      .send(cancer)
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        done();
      });
  });

  // create patients
  it('/patients - POST - (create patient)', function (done){
    request(app)
      .post('/patients')
      .send(jeremy)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('patient already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(jeremy['email']);
        done();
      });
  });
  it('/patients - POST - (create patient)', function (done){
    request(app)
      .post('/patients')
      .send(barrack)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('patient already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(barrack['email']);
        done();
      });
  });
  it('/patients - POST - (create patient)', function (done){
    request(app)
      .post('/patients')
      .send(oprah)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('patient already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(oprah['email']);
        done();
      });
  });
  it('/patients - POST - (create patient)', function (done){
    request(app)
      .post('/patients')
      .send(marisa)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('patient already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(marisa['email']);
        done();
      });
  });
  it('/patients - POST - (create patient)', function (done){
    request(app)
      .post('/patients')
      .send(michelle)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('patient already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(michelle['email']);
        done();
      });
  });
  it('/patients - POST - (create patient)', function (done){
    request(app)
      .post('/patients')
      .send(samuel)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('patient already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(samuel['email']);
        done();
      });
  });
});