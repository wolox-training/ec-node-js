const chai = require('chai'),
  nock = require('nock'),
  dictum = require('dictum.js'),
  sessionManager = require('../app/services/sessionManager'),
  server = require('./../app'),
  should = chai.should();

const authenticate = email => sessionManager.encode(email);

describe('albums', () => {
  beforeEach(() => {
    nock('https://jsonplaceholder.typicode.com/')
      .get('/albums')
      .reply(200, [
        {
          userId: 1,
          id: 1,
          title: 'quidem molestiae enim'
        },
        {
          userId: 1,
          id: 2,
          title: 'sunt qui excepturi placeat culpa'
        },
        {
          userId: 1,
          id: 3,
          title: 'omnis laborum odio'
        }
      ]);
  });
  describe('/albums GET', () => {
    it('should be successful', done => {
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
  });
});
