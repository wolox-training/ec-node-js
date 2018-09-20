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

          res.body.message.should.be.equal('No authorization provided'); // TODO
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
            res.should.have.status(500);
            res.should.be.json;
            res.body.should.have.property('message');
            res.body.should.have.property('internal_code');

            res.body.message.should.be.equal('Cannot access external API');
            done();
          })
          .catch(err => done(err))
      );
    });
  });
});
