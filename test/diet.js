'use strict';

var request = require('supertest');
var expect = require("chai").expect;
var mongoose = require('mongoose');
var S = require("string");
var execSync = require('execSync');

var app = require('../middleware/express');
//var app = require('express')();

var doctor = {
  email: "doctor@test.com",
  first_name: "doctor",
  last_name: "test",
  specialty: "specs",
  hospital: "hosp",
  pass: "pass" 
};
var patient = {
  email: "patient@test.com",
  first_name: "patient",
  last_name: "test",
  group: "example",
  doctor: "doctor@test.com",
  pass: "pass",
  age:  21 ,
  height:  72 ,
  weight:  195 ,
  sex: "male" 
};
var group = {_id:"example"};
var diet1 = {
  email: "patient@test.com",
  created: "23:06-06-16-2015",
  food: "apple",
  calories: 80
}
var diet2 = {
  email: "patient@test.com",
  created: "16:06-07-16-2015",
  food: "steak",
  calories: 560
}
var update_diet2 = {
  email: "patient@test.com",
  created: "16:06-07-16-2015",
  food: "burger",
  calories: 460
}

describe('DIET TEST', function(){
  // creating prerequisites for tests (doctor, patient, group)
  //curl --request POST localhost:5025/doctors --data "email=doctor@test.com" --data "first_name=doctor" --data "last_name=test" --data "specialty=specs" --data "hospital=hosp" --data "pass=pass" 
  it('/doctors - POST - (create doctor)', function (done){
    request(app)
      .post('/doctors')
      .send(doctor)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('doctor already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(doctor['email']);
        execSync.exec('./test/make_admin.sh '+doctor.email);
        done();
      });
  });
  it('/groups - POST - (create group)', function (done){
    request(app)
      .post('/groups')
      .auth(doctor['email'], doctor["pass"])
      .send(group)
      .end(function (err, res){
        done();
      });
  });
  //curl --request POST localhost:5025/patients --data "email=patient@test.com" --data "first_name=patient" --data "last_name=test" --data "group=example" --data "doctor=doctor@test.com" --data "pass=pass" --data "age=21" --data "height=72" --data "weight=195" --data "sex=male" 
  it('/patients - POST - (create patient)', function (done){
    request(app)
      .post('/patients')
      .send(patient)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('patient already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(patient['email']);
        done();
      });
  });


  it('/diet - POST - (food entry)', function (done) {
    request(app)
      .post('/diet')
      .auth(patient['email'], patient["pass"])
      .send(diet1)
      .end(function (err, res) {
        expect(res.status).to.not.equal(401);
        expect(diet1.email).to.equal(res.body.email);
        expect(diet1.created).to.equal(res.body.created);
        expect(diet1.food).to.equal(res.body.food);
        expect(diet1.calories).to.equal(res.body.calories);
        done();
      });
  });
  it('/diet - POST - (food entry)', function (done) {
    request(app)
      .post('/diet')
      .auth(patient['email'], patient["pass"])
      .send(diet2)
      .end(function (err, res) {
        expect(res.status).to.not.equal(401);
        expect(diet2.email).to.equal(res.body.email);
        expect(diet2.created).to.equal(res.body.created);
        expect(diet2.food).to.equal(res.body.food);
        expect(diet2.calories).to.equal(res.body.calories);
        done();
      });
  });
  it('/diet - GET - (food entry)', function (done) {
    request(app)
      .get('/diet')
      .auth(patient['email'], patient["pass"])
      .end(function (err, res) {
        expect(res.status).to.not.equal(401);
        expect(res.body.length).to.equal(2);
        done();
      });
  });
  it('/diet/:timestamp - GET - (food entry)', function (done) {
    request(app)
      .get('/diet/'+diet2.created)
      .auth(patient['email'], patient["pass"])
      .end(function (err, res) {
        expect(res.status).to.not.equal(401);
        expect(diet2.email).to.equal(res.body.email);
        expect(diet2.created).to.equal(res.body.created);
        expect(diet2.food).to.equal(res.body.food);
        expect(diet2.calories).to.equal(res.body.calories);
        done();
      });
  });
  it('/diet/:patient_email - GET - (food entry)', function (done) {
    request(app)
      .get('/diet/doctor/'+patient.email)
      .auth(doctor['email'], doctor["pass"])
      .end(function (err, res) {
        expect(res.status).to.not.equal(401);
        expect(res.body.length).to.equal(2);
        done();
      });
  });
  it('/diet/:patient_email/:timestamp - GET - (food entry)', function (done) {
    request(app)
      .get('/diet/doctor/'+patient.email+'/'+diet2.created)
      .auth(doctor['email'], doctor["pass"])
      .end(function (err, res) {
        expect(res.status).to.not.equal(401);
        expect(diet2.email).to.equal(res.body.email);
        expect(diet2.created).to.equal(res.body.created);
        expect(diet2.food).to.equal(res.body.food);
        expect(diet2.calories).to.equal(res.body.calories);
        done();
      });
  });
  it('/diet - PUT - (food entry)', function (done) {
    request(app)
      .put('/diet/'+diet2.created)
      .auth(patient['email'], patient["pass"])
      .send(update_diet2)
      .end(function (err, res) {
        expect(res.status).to.not.equal(401);
        expect(diet2.email).to.equal(res.body.email);
        expect(diet2.created).to.equal(res.body.created);
        expect(diet2.food).to.equal(res.body.food);
        expect(diet2.calories).to.equal(res.body.calories);
        done();
      });
  });
  it('/diet/:patient_email/:timestamp - GET - (food entry)', function (done) {
    request(app)
      .get('/diet/doctor/'+patient.email+'/'+update_diet2.created)
      .auth(doctor['email'], doctor["pass"])
      .end(function (err, res) {
        expect(res.status).to.not.equal(401);
        expect(update_diet2.email).to.equal(res.body.email);
        expect(update_diet2.created).to.equal(res.body.created);
        expect(update_diet2.food).to.equal(res.body.food);
        expect(update_diet2.calories).to.equal(res.body.calories);
        done();
      });
  });
  it('/diet/:timestamp - DELETE', function (done){
    request(app)
      .del('/diet/'+diet1.created)
      .auth(patient['email'], patient["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        expect(res.status).to.not.equal(401);
        done();
      });
  });
  it('/diet/:timestamp - DELETE', function (done){
    request(app)
      .del('/diet/'+update_diet2.created)
      .auth(patient['email'], patient["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        expect(res.status).to.not.equal(401);
        done();
      });
  });


  // deleting prerequisites for tests (doctor, patient, group)
  //curl --request POST localhost:5025/patients/remove --data "email=patient@test.com" --data "first_name=new_patient" --data "last_name=new_test" --data "group=new_example" --data "doctor=doctor@test.com" --data "pass=new_pass" --data "age=99" --data "height=99" --data "weight=99" --data "sex=male" 
  it('/patients/remove - DELETE', function (done){
    request(app)
      .del('/patients/remove')
      .auth(patient['email'], patient["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  //removes group
  it('/groups/remove/:groupid - DELETE', function(done){
    request(app)
      .del('/groups/remove/'+group["_id"])
      .auth(doctor["email"], doctor["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  //remove patients doctor
  it('/doctors/remove - DELETE', function (done){
    request(app)
      .del('/doctors/remove')
      .auth("doctor@test.com", "pass")
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
});