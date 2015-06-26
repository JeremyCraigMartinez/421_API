'use strict';

var request = require('supertest');
var expect = require("chai").expect;
var S = require("string");

var app = require('../middleware/express');
//var app = require('express')();

describe('DOCTOR TESTS', function(){
  var doctor = {
    email      : "example@test.com",
    first_name : "example",
    last_name  : "test",
    specialty  : "specs",
    hospital   : "hosp",
    pass       : "pass" 
  };
  var new_doctor = {
  	email: "example@test.com",
  	first_name: "new_example",
  	last_name: "new_test",
  	specialty: "new_specs",
  	hospital: "new_hosp",
  };
  var new_doctor_creds = {
    email: "new_example@test.com",
    pass: "new_pass"
  }

  //curl --request POST localhost:5025/doctors --data "email=example@test.com" --data "first_name=example" --data "last_name=test" --data "specialty=specs" --data "hospital=hosp" --data "pass=pass" 
  it('/doctors - POST - (create doctor)', function(done){
    request(app)
      .post('/doctors')
      .send(doctor)
      .end(function (err, res){
        if (res.body['error']) {
          console.log(res.body['error']);
          expect(S(res.body['error']).startsWith('doctor already exists')).to.be.true;
        }
        else
          expect(res.body['email']).to.equal(doctor['email']);
        done();
      });
  });
  it('/doctors - GET - (all doctors)', function(done){
    request(app)
      .get('/doctors')
      .auth(doctor['email'], doctor["pass"])
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(res.body.indexOf("example@test.com")).to.not.equal(-1);
        done();
      });
  });
  it('/doctors/:email - GET - (specific doctor)', function(done){
    request(app)
      .get('/doctors/'+doctor["email"])
      .auth(doctor['email'], doctor["pass"])
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  //curl --request POST localhost:5025/doctors/update_info --data "email=example@test.com" --data "first_name=new_example" --data "last_name=new_test" --data "specialty=new_specs" --data "hospital=new_hosp" --data "pass=new_pass"     
  it('/doctors/update_info - PUT', function(done){
    request(app)
      .put('/doctors/update_info')
      .auth(doctor['email'], doctor["pass"])
      .send(new_doctor)
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(err).to.be.null;
        done();
      });
  });
  it('/doctors/:email - GET - (specific doctor)', function(done){
    request(app)
      .get('/doctors/'+new_doctor["email"])
      .auth(doctor['email'], doctor["pass"])
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(res.body['specialty']).to.equal('new_specs');
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/doctors/update_account - PUT', function(done){
    request(app)
      .put('/doctors/update_account')
      .auth(doctor['email'], doctor["pass"])
      .send(new_doctor_creds)
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(err).to.be.null;
        done();
      });
  });
  it('/doctors/:email - GET - (specific doctor)', function(done){
    request(app)
      .get('/doctors/'+new_doctor_creds["email"])
      .auth(new_doctor_creds["email"], new_doctor_creds["pass"])
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/doctors/remove - DELETE', function(done){
    request(app)
      .del('/doctors/remove')
      .auth(new_doctor_creds["email"], new_doctor_creds["pass"])
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
});