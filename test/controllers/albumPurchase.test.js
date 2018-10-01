const chai = require('chai'),
  dictum = require('dictum.js'),
  sessionManager = require('../../app/services/sessionManager'),
  server = require('../../app'),
  albumPurchasesHelpers = require('../helpers/albumPurchases'),
  usersHelpers = require('../helpers/users'),
  should = chai.should();

describe('Album Purchases', () => {
  describe('GET /albums', () => {
    it('Given a default user token as auth and request mocked to succeed should be successful', done => {
      albumPurchasesHelpers.mockIndexToSuccess();
      usersHelpers.createUserAndAuth().then(({ authorization }) =>
        chai
          .request(server)
          .get('/albums')
          .set(sessionManager.HEADER_NAME, authorization)
          .send()
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.instanceOf(Array);

            res.body[0].should.have.property('albumId');
            res.body[0].should.have.property('title');
            res.body[0].should.have.property('userId');

            dictum.chai(res);
            done();
          })
          .catch(err => done(err))
      );
    });
    it('Without a token as auth and request mocked to succeed should be unsuccessful', done => {
      chai
        .request(server)
        .get('/albums')
        .send()
        .then(res => {
          res.should.have.status(401);
          res.should.be.json;

          res.body.message.should.be.equal('No authorization provided');
          done();
        })
        .catch(err => done(err));
    });
    it('Given a default user token as auth and request mocked to fail should be unsuccessful', done => {
      albumPurchasesHelpers.mockIndexToFail();
      usersHelpers.createUserAndAuth().then(({ authorization }) =>
        chai
          .request(server)
          .get('/albums')
          .set(sessionManager.HEADER_NAME, authorization)
          .send()
          .then(res => {
            res.should.have.status(503);
            res.should.be.json;
            res.body.should.have.property('message');
            res.body.should.have.property('internal_code');

            res.body.message.should.be.equal('Error consulting external API');
            done();
          })
          .catch(err => done(err))
      );
    });
  });
  describe('POST /albums/:id', () => {
    it('Given a default user that have not bought the album yet should be successful', done => {
      const id = 1;
      albumPurchasesHelpers.mockShowToSuccess(id);
      usersHelpers.createUserAndAuth().then(({ authorization }) =>
        chai
          .request(server)
          .post(`/albums/${id}`)
          .set(sessionManager.HEADER_NAME, authorization)
          .send()
          .then(res => {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.have.property('id');
            res.body.should.have.property('albumId');
            res.body.should.have.property('buyerId');
            res.body.should.have.property('title');
            dictum.chai(res);
            done();
          })
          .catch(err => done(err))
      );
    });
    it('Given a default user that already bought the album should be unsuccessful', done => {
      const id = 1;
      albumPurchasesHelpers.mockShowToSuccess(id);
      usersHelpers.createUserAndAuth().then(({ user, authorization }) =>
        chai
          .request(server)
          .post(`/albums/${id}`)
          .set(sessionManager.HEADER_NAME, authorization)
          .send()
          .then(() =>
            chai
              .request(server)
              .post(`/albums/${id}`)
              .set(sessionManager.HEADER_NAME, authorization)
              .send()
              .then(res => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.message.should.be.equal(`User '${user.email}' already purchases album #${id}`);
                done();
              })
          )
          .catch(err => done(err))
      );
    });
    it('Given an admin user that have not bought the album yet should be successful', done => {
      const id = 1;
      albumPurchasesHelpers.mockShowToSuccess(id);
      usersHelpers.createAdminAndAuth().then(({ authorization }) =>
        chai
          .request(server)
          .post(`/albums/${id}`)
          .set(sessionManager.HEADER_NAME, authorization)
          .send()
          .then(res => {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.have.property('id');
            res.body.should.have.property('albumId');
            res.body.should.have.property('buyerId');
            res.body.should.have.property('title');
            dictum.chai(res);
            done();
          })
          .catch(err => done(err))
      );
    });
    it('Given an admin user that already bought the album should be unsuccessful', done => {
      const id = 1;
      albumPurchasesHelpers.mockShowToSuccess(id);
      usersHelpers.createAdminAndAuth().then(({ admin, authorization }) =>
        chai
          .request(server)
          .post(`/albums/${id}`)
          .set(sessionManager.HEADER_NAME, authorization)
          .send()
          .then(() =>
            chai
              .request(server)
              .post(`/albums/${id}`)
              .set(sessionManager.HEADER_NAME, authorization)
              .send()
              .then(res => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.message.should.be.equal(`User '${admin.email}' already purchases album #${id}`);
                done();
              })
          )
          .catch(err => done(err))
      );
    });
    it('Given a non-authenticated user should be unsuccessful', done => {
      chai
        .request(server)
        .post(`/albums/1`)
        .send()
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
    it('Given a non-existing album id', done => {
      const id = 1;
      albumPurchasesHelpers.mockShowToNotFound(id);
      usersHelpers.createUserAndAuth().then(({ authorization }) =>
        chai
          .request(server)
          .post(`/albums/${id}`)
          .set(sessionManager.HEADER_NAME, authorization)
          .send()
          .then(res => {
            res.should.have.status(404);
            res.should.be.json;
            res.body.should.have.property('message');
            res.body.should.have.property('internal_code');
            res.body.message.should.be.equal(`Resource album ${id} not found`);
            done();
          })
          .catch(err => done(err))
      );
    });
    it('Given a no-valid album id', done => {
      const id = 'not_valid';
      albumPurchasesHelpers.mockShowToSuccess(id);
      usersHelpers.createUserAndAuth().then(({ authorization }) =>
        chai
          .request(server)
          .post(`/albums/${id}`)
          .set(sessionManager.HEADER_NAME, authorization)
          .send()
          .then(res => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.have.property('message');
            res.body.should.have.property('internal_code');
            res.body.message[0].message.should.be.equal('"albumId" must be a number');
            done();
          })
          .catch(err => done(err))
      );
    });
    it('Given an external API error system should handle it', done => {
      const id = 1;
      albumPurchasesHelpers.mockShowToFail(id);
      usersHelpers.createUserAndAuth().then(({ authorization }) =>
        chai
          .request(server)
          .post(`/albums/${id}`)
          .set(sessionManager.HEADER_NAME, authorization)
          .send()
          .then(res => {
            res.should.have.status(503);
            res.should.be.json;
            res.body.should.have.property('message');
            res.body.should.have.property('internal_code');
            res.body.message.should.be.equal('Error consulting external API');
            done();
          })
          .catch(err => done(err))
      );
    });
  });
});
