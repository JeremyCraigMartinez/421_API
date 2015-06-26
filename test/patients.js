'use strict';

var request = require('supertest');
var expect = require("chai").expect;
var S = require("string");

var app = require('../middleware/express');
//var app = require('express')();

describe('PATIENT TEST', function(){
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
    var new_patient = {
    	email: "patient@test.com",
    	first_name: "new_patient",
    	last_name: "new_test",
    	group: "new_example",
    	doctor: "doctor@test.com",
    	age:  99 ,
    	height:  99 ,
    	weight:  99 ,
    	sex: "male" 
    };
    var new_creds = {
      email: "new_patient@test.com",
      pass: "new_pass"
    }
    var group = {_id:"example"};

    //create patients doctor
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
    //authenticate as doctor
    //curl --request GET localhost:5025/patients
    it('/patients - GET - (all patients)', function (done){
      request(app)
        .get('/list_of_patients')
        .auth(doctor['email'], doctor["pass"])
        .end(function (err, res){
          expect(res.body.indexOf("patient@test.com")).to.not.equal(-1);
          done();
        });
    });
    it('/patients/ - GET - (specific patient)', function (done){
      request(app)
        .get('/patients')
        .auth(patient['email'], patient["pass"])
        .end(function (err, res){
          expect(Object.keys(res.body).length).to.not.equal(0);
          done();
        });
    });
    //curl --request POST localhost:5025/patients --data "email=patient@test.com" --data "first_name=new_patient" --data "last_name=new_test" --data "group=new_example" --data "doctor=doctor@test.com" --data "pass=new_pass" --data "age=99" --data "height=99" --data "weight=99" --data "sex=male" 
    it('/patients/update_info - PUT', function (done){
      request(app)
        .put('/patients/update_info')
        .auth(patient['email'], patient["pass"])
        .send(new_patient)
        .end(function (err, res){
          expect(err).to.be.null;
          done();
        });
    });
    it('/patients/ - GET - (specific patient)', function (done){
      request(app)
        .get('/patients')
        .auth(patient['email'], patient["pass"])
        .end(function (err, res){
          expect(Object.keys(res.body).length).to.not.equal(0);
          for (var each in new_patient) {
            if (each != "pass" && each != "group") {
              expect(new_patient[each]).to.equal(res.body[each]);
            }
          }
          done();
        });
    });
    //curl --request POST localhost:5025/patients --data "email=patient@test.com" --data "first_name=new_patient" --data "last_name=new_test" --data "group=new_example" --data "doctor=doctor@test.com" --data "pass=new_pass" --data "age=99" --data "height=99" --data "weight=99" --data "sex=male" 
    it('/patients/update_account - PUT', function (done){
      request(app)
        .put('/patients/update_account')
        .auth(patient['email'], patient["pass"])
        .send(new_creds)
        .end(function (err, res){
          expect(err).to.be.null;
          done();
        });
    });
    it('/patients/ - GET - (specific patient)', function (done){
      request(app)
        .get('/patients')
        .auth(new_creds['email'], new_creds["pass"])
        .end(function (err, res){
          expect(Object.keys(res.body).length).to.not.equal(0);
          done();
        });
    });
    //curl --request POST localhost:5025/patients/remove --data "email=patient@test.com" --data "first_name=new_patient" --data "last_name=new_test" --data "group=new_example" --data "doctor=doctor@test.com" --data "pass=new_pass" --data "age=99" --data "height=99" --data "weight=99" --data "sex=male" 
    it('/patients/remove - DELETE', function (done){
      request(app)
        .del('/patients/remove')
        .auth(new_creds['email'], new_creds["pass"])
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






    // testing CASCADE ON DELETE for patients-doctor relationship
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
          done();
        });
    });
    it('/groups - POST - (create group)', function (done){
      request(app)
        .post('/groups')
        .auth(doctor["email"], doctor["pass"])
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
    it('/patients/ - GET - (specific patient)', function (done){
      request(app)
        .get('/patients')
        .auth(patient['email'], patient["pass"])
        .end(function (err, res){
          for (var each in patient) {
            if (each === "group") {
              expect(patient[each]).to.equal(res.body[each][0]);
            }
            else if (each != "pass") {
              expect(patient[each]).to.equal(res.body[each]);
            }
          }
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
        .auth(doctor["email"], doctor["pass"])
        .end(function (err, res){
          expect(Object.keys(res.body).length).to.not.equal(0);
          done();
        });
    });
    it('/patients/ - GET - (specific patient)', function (done){
      request(app)
        .get('/patients')
        .auth(patient['email'], patient["pass"])
        .end(function (err, res){
          expect(res.body['doctor']).to.equal(null);
          expect(res.body['group'].length).to.equal(0);
          done();
        });
    });
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
});