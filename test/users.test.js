const chai = require('chai'),
  dictum = require('dictum.js'),
  sessionManager = require('../app/services/sessionManager'),
  userService = require('../app/services/users'),
  server = require('./../app'),
  should = chai.should();

const authenticate = email => sessionManager.encode(email);

const countRecords = () => userService.count();

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
          res.should.have.status(201);
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

          res.body.message[0].message.should.be.equal('"password" is required');
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

          res.body.message[0].message.should.be.equal('"email" must be a valid email');
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

          res.body.message[0].message.should.be.equal(
            '"email" with value "email@other.com.ar" fails to match the Wolox e-mail pattern'
          );
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

          res.body.message[0].message.should.be.equal(
            '"password" with value "password" fails to match the Alphanumeric pattern'
          );
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

          res.body.message[0].message.should.be.equal('"password" length must be at least 8 characters long');
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

          res.body.message.should.be.equal("E-mail 'joe.doe@wolox.com.ar' already registered");
        })
        .then(() => done());
    });
  });
  describe('/users/sessions POST', () => {
    it('should be successful', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send({
          password: 'password1234',
          email: 'joe.doe@wolox.com.ar'
        })
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;
          res.headers.should.have.property(sessionManager.HEADER_NAME);
          sessionManager
            .decode(res.headers[sessionManager.HEADER_NAME])
            .should.be.equal('joe.doe@wolox.com.ar');
          dictum.chai(res);
        })
        .then(() => done());
    });
    it('should fail because mail is not valid', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send({
          password: 'password1234',
          email: 'email@other.com'
        })
        .then(res => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');

          res.body.message[0].message.should.be.equal(
            '"email" with value "email@other.com" fails to match the Wolox e-mail pattern'
          );
        })
        .then(() => done());
    });
    it('should fail because password is invalid', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send({
          password: 'short12',
          email: 'joe.doe@wolox.com.ar'
        })
        .then(res => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');

          res.body.message[0].message.should.be.equal('"password" length must be at least 8 characters long');
        })
        .then(() => done());
    });
    it('should fail because email does not exist', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send({
          password: 'password1234',
          email: 'not.exist@wolox.com.ar'
        })
        .then(res => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');

          res.body.message.should.be.equal('Cannot find user not.exist@wolox.com.ar!');
        })
        .then(() => done());
    });
    it('should fail because email or password are incorrect', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send({
          password: '123notcorrect',
          email: 'joe.doe@wolox.com.ar'
        })
        .then(res => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');

          res.body.message.should.be.equal('Email or password are incorrect!');
        })
        .then(() => done());
    });
  });
  describe('/admin/users POST', () => {
    it('should be successful with existing user request and using authenticated admin user', done => {
      const hash = authenticate('admin.user@wolox.com.ar');
      chai
        .request(server)
        .post('/admin/users')
        .set(sessionManager.HEADER_NAME, hash)
        .send({
          firstName: 'Joe',
          lastName: 'Doe',
          password: 'password1234',
          email: 'joe.doe@wolox.com.ar'
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
    it('should be successful with non-existing user request and using authenticated admin user', done => {
      const hash = authenticate('admin.user@wolox.com.ar');
      chai
        .request(server)
        .post('/admin/users')
        .set(sessionManager.HEADER_NAME, hash)
        .send({
          firstName: 'Anna',
          lastName: 'Rose',
          password: 'password1234',
          email: 'anna.rose@wolox.com.ar'
        })
        .then(res => {
          res.should.have.status(201);
          res.body.should.have.property('firstName');
          res.body.should.have.property('lastName');
          res.body.should.have.property('email');
          res.body.should.have.property('password');
          dictum.chai(res);
        })
        .then(() => done());
    });
    it('should fail using authenticated normal user', done => {
      const hash = authenticate('joe.doe@wolox.com.ar');
      chai
        .request(server)
        .post('/admin/users')
        .set(sessionManager.HEADER_NAME, hash)
        .send({
          firstName: 'Anna',
          lastName: 'Rose',
          password: 'password1234',
          email: 'anna.rose@wolox.com.ar'
        })
        .then(res => {
          res.should.have.status(403);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');

          res.body.message.should.be.equal('User joe.doe@wolox.com.ar is not Admin'); // TODO
        })
        .then(() => done());
    });
    it('should fail non-authenticated request', done => {
      chai
        .request(server)
        .post('/admin/users')
        .send({
          firstName: 'Anna',
          lastName: 'Rose',
          password: 'password1234',
          email: 'anna.rose@wolox.com.ar'
        })
        .then(res => {
          res.should.have.status(401);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');

          res.body.message.should.be.equal('No authorization provided'); // TODO
        })
        .then(() => done());
    });
    it('should fail using a invalid token', done => {
      chai
        .request(server)
        .post('/admin/users')
        .set(sessionManager.HEADER_NAME, 'non-valid-hash')
        .send({
          firstName: 'Anna',
          lastName: 'Rose',
          password: 'password1234',
          email: 'anna.rose@wolox.com.ar'
        })
        .then(res => {
          res.should.have.status(401);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');

          res.body.message.should.be.equal('Error verifying hash'); // TODO
        })
        .then(() => done());
    });
    describe('/users GET', () => {
      it('should be successful', done => {
        const hash = authenticate('joe.doe@wolox.com.ar');
        chai
          .request(server)
          .get('/users')
          .query({ limit: 5, page: 0 })
          .set(sessionManager.HEADER_NAME, hash)
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('page');
            res.body.should.have.property('count');
            res.body.should.have.property('rows');
            dictum.chai(res);
          })
          .then(() => done());
      });
      it('should return as many rows per page as the established limit', done => {
        const hash = authenticate('joe.doe@wolox.com.ar');
        chai
          .request(server)
          .get('/users')
          .query({ limit: 2, page: 0 })
          .set(sessionManager.HEADER_NAME, hash)
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('page');
            res.body.should.have.property('count');
            res.body.should.have.property('rows');

            res.body.rows.length.should.be.equal(2);
          })
          .then(() => done());
      });
      it('should return the rows correponding to last page', done => {
        const hash = authenticate('joe.doe@wolox.com.ar');
        countRecords().then(totalRows => {
          const limit = 5;
          const page = Math.ceil(totalRows / limit) - 1; // Last page with results
          const offset = totalRows - page * limit;
          chai
            .request(server)
            .get('/users')
            .query({ limit, page })
            .set(sessionManager.HEADER_NAME, hash)
            .then(res => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.have.property('page');
              res.body.should.have.property('count');
              res.body.should.have.property('rows');

              res.body.page.should.be.equal(page.toString());

              res.body.rows.length.should.be.equal(offset);
            })
            .then(() => done());
        });
      });
      it('should return an empty array because page overshoot total rows', done => {
        const hash = authenticate('joe.doe@wolox.com.ar');
        countRecords().then(totalRows => {
          const limit = 5;
          const page = Math.ceil(totalRows / limit) + 1; // First page without results
          chai
            .request(server)
            .get('/users')
            .query({ limit, page })
            .set(sessionManager.HEADER_NAME, hash)
            .then(res => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.have.property('page');
              res.body.should.have.property('count');
              res.body.should.have.property('rows');

              res.body.page.should.be.equal(page.toString());

              res.body.rows.length.should.be.equal(0);
            })
            .then(() => done());
        });
      });
      it('should fail because limit is not a number', done => {
        const hash = authenticate('joe.doe@wolox.com.ar');
        chai
          .request(server)
          .get('/users')
          .query({ limit: 'string', page: 0 })
          .set(sessionManager.HEADER_NAME, hash)
          .then(res => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.have.property('message');
            res.body.should.have.property('internal_code');

            res.body.message[0].message.should.be.equal('"limit" must be a number');
          })
          .then(() => done());
      });
    });
    it('should fail because page is not a number', done => {
      const hash = authenticate('joe.doe@wolox.com.ar');
      chai
        .request(server)
        .get('/users')
        .set(sessionManager.HEADER_NAME, hash)
        .query({ limit: 5, page: 'string' })
        .then(res => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');

          res.body.message[0].message.should.be.equal('"page" must be a number');
        })
        .then(() => done());
    });
  });
});
