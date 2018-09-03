const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should();

describe('users', () => {
  describe('/users POST', () => {
    it('should be successful', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: 'firstName',
          lastName: 'lastName',
          password: 'pass1234',
          email: 'user@wolox.com.ar'
        })
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('firstName');
          res.body.should.have.property('lastName');
          res.body.should.have.property('email');
          res.body.should.have.property('password');
          dictum.chai(res);
        })
        .then(() => done());
    });
    it('should fail because password is missing', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: 'firstName',
          lastName: 'lastName',
          username: 'username',
          email: 'user@wolox.com.ar'
        })
        .then(res => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');
        })
        .then(() => done());
    });
    it('should fail because email is not valid', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: 'firstName',
          lastName: 'lastName',
          password: 'password123',
          email: 'email'
        })
        .then(res => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');
        })
        .then(() => done());
    });
    it('should fail because email is not from Wolox', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: 'firstName',
          lastName: 'lastName',
          password: 'password123',
          email: 'email@other.com.ar'
        })
        .then(res => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');
        })
        .then(() => done());
    });
    it('should fail because password is not alphanumeric', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: 'firstName',
          lastName: 'lastName',
          password: 'password',
          email: 'email@wolox.com.ar'
        })
        .then(res => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');
        })
        .then(() => done());
    });
    it('should fail because password is shorter than 8 characters', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: 'firstName',
          lastName: 'lastName',
          password: '123abc',
          email: 'email@wolox.com.ar'
        })
        .then(res => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');
        })
        .then(() => done());
    });
    it('should fail because email already exist', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: 'firstName',
          lastName: 'lastName',
          password: 'password1234',
          email: 'joe.doe@wolox.com.ar'
        })
        .then(res => {
          res.should.have.status(409);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');
        })
        .then(() => done());
    });
  });
});
