const chai = require('chai'),
  nock = require('nock'),
  dictum = require('dictum.js'),
  sessionManager = require('../app/services/sessionManager'),
  server = require('./../app'),
  should = chai.should();

const authenticate = email => sessionManager.encode(email);

const successfullProxy = () =>
  nock('https://jsonplaceholder.typicode.com/')
    .get('/albums')
    .reply(200, [
      { userId: 1, id: 1, title: 'quidem molestiae enim' },
      { userId: 1, id: 2, title: 'sunt qui excepturi placeat culpa' },
      { userId: 1, id: 3, title: 'omnis laborum odio' }
    ]);

const failureProxy = () =>
  nock('https://jsonplaceholder.typicode.com/')
    .get('/albums')
    .reply(500, 'Something went wrong!');

describe('albums', () => {
  describe('/albums GET', () => {
    it('should be successful', done => {
      successfullProxy();
      const hash = authenticate('joe.doe@wolox.com.ar');
      chai
        .request(server)
        .get('/albums')
        .set(sessionManager.HEADER_NAME, hash)
        .send()
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.instanceOf(Array);
          dictum.chai(res);
        })
        .then(() => done());
    });
    it('should fail with non-authenticated requests', done => {
      chai
        .request(server)
        .get('/albums')
        .send()
        .then(res => {
          res.should.have.status(401);
          res.should.be.json;

          res.body.message.should.be.equal('No authorization provided'); // TODO
        })
        .then(() => done());
    });
    it('ONLY should handle external api error case', done => {
      failureProxy();
      const hash = authenticate('joe.doe@wolox.com.ar');
      chai
        .request(server)
        .get('/albums')
        .set(sessionManager.HEADER_NAME, hash)
        .send()
        .then(res => {
          res.should.have.status(500);
          res.should.be.json;

          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');

          res.body.message.should.be.equal('Cannot access external API');
        })
        .then(() => done());
    });
  });
});
