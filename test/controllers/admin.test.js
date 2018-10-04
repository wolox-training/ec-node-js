const chai = require('chai'),
  dictum = require('dictum.js'),
  sessionManager = require('../../app/services/sessionManager'),
  server = require('../../app'),
  usersHelpers = require('../helpers/users'),
  should = chai.should();

describe('Admin users', () => {
  describe('POST /admin/users', () => {
    it('Given an admin user token as auth and using an existing user as body should be successful', done => {
      usersHelpers.createAdminAndAuth().then(({ admin, authorization }) =>
        chai
          .request(server)
          .post('/admin/users')
          .set(sessionManager.HEADER_NAME, authorization)
          .send(
            usersHelpers.fakes.user({
              firstName: admin.firstName,
              lastName: admin.lastName,
              email: admin.email
            })
          )
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('firstName');
            res.body.should.have.property('lastName');
            res.body.should.have.property('email');
            res.body.should.have.property('password');

            dictum.chai(res);
            done();
          })
          .catch(err => done(err))
      );
    });
    it('Given an admin user token as auth and using an non-existing user as body should be succesful', done => {
      usersHelpers.createAdminAndAuth().then(({ authorization }) =>
        chai
          .request(server)
          .post('/admin/users')
          .set(sessionManager.HEADER_NAME, authorization)
          .send(usersHelpers.fakes.user())
          .then(res => {
            res.should.have.status(201);
            res.body.should.have.property('firstName');
            res.body.should.have.property('lastName');
            res.body.should.have.property('email');
            res.body.should.have.property('password');

            dictum.chai(res);
            done();
          })
          .catch(err => done(err))
      );
    });
    it('Given a default user token as auth should be unsuccessful', done => {
      usersHelpers.createUserAndAuth().then(({ user, authorization }) =>
        chai
          .request(server)
          .post('/admin/users')
          .set(sessionManager.HEADER_NAME, authorization)
          .send(usersHelpers.fakes.user())
          .then(res => {
            res.should.have.status(403);
            res.should.be.json;
            res.body.should.have.property('message');
            res.body.should.have.property('internal_code');

            res.body.message.should.be.equal(`User '${user.email}' has not permissions`);
            done();
          })
          .catch(err => done(err))
      );
    });
    it('Given a request without a token as auth should be unsuccessful', done => {
      chai
        .request(server)
        .post('/admin/users')
        .send(usersHelpers.fakes.user())
        .then(res => {
          res.should.have.status(401);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');

          res.body.message.should.be.equal('No authorization provided');
          done();
        })
        .catch(err => done(err));
    });
    it('Given an invalid token as auth should be unsuccessful', done => {
      chai
        .request(server)
        .post('/admin/users')
        .set(sessionManager.HEADER_NAME, 'non-valid-hash')
        .send(usersHelpers.fakes.user())
        .then(res => {
          res.should.have.status(401);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');

          res.body.message.should.be.equal('jwt malformed');
          done();
        })
        .catch(err => done(err));
    });
    it('Given an expired token as auth should be unsuccessful', done => {
      usersHelpers.createUserAndAuthExpired().then(({ authorization }) =>
        chai
          .request(server)
          .post('/admin/users')
          .set(sessionManager.HEADER_NAME, authorization)
          .send(usersHelpers.fakes.user())
          .then(res => {
            res.should.have.status(401);
            res.should.be.json;
            res.body.should.have.property('message');
            res.body.should.have.property('internal_code');

            res.body.message.should.be.equal('jwt expired');
            done();
          })
          .catch(err => done(err))
      );
    });
    it('Given a valid token as auth but an non-existent user should be unsuccessful', done => {
      const { authorization } = usersHelpers.authNonExistingUser();
      chai
        .request(server)
        .post('/admin/users')
        .set(sessionManager.HEADER_NAME, authorization)
        .send(usersHelpers.fakes.user())
        .then(res => {
          res.should.have.status(401);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');

          res.body.message.should.be.equal('Error checking token');
          done();
        })
        .catch(err => done(err));
    });
  });
});
