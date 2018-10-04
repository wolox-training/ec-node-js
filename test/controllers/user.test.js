const chai = require('chai'),
  dictum = require('dictum.js'),
  sessionManager = require('../../app/services/sessionManager'),
  userService = require('../../app/services/users'),
  server = require('../../app'),
  usersHelpers = require('../helpers/users'),
  albumPurchasesHelpers = require('../helpers/albumPurchases'),
  should = chai.should();

describe('Users', () => {
  describe('GET /users', () => {
    it('Given a default user token as auth should be successful', done => {
      usersHelpers.createManyUsersAndAuth().then(({ authorization }) => {
        chai
          .request(server)
          .get('/users')
          .query({ limit: 5, page: 0 })
          .set(sessionManager.HEADER_NAME, authorization)
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
    });
    it('Given a page limit should return as many rows per page as the established limit', done => {
      usersHelpers.createManyUsersAndAuth(15).then(({ authorization }) => {
        chai
          .request(server)
          .get('/users')
          .query({ limit: 5, page: 0 })
          .set(sessionManager.HEADER_NAME, authorization)
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('page');
            res.body.should.have.property('count');
            res.body.should.have.property('rows');

            res.body.rows.length.should.be.equal(5);
          })
          .then(() => done());
      });
    });
    it('Given a page limit the number of rows in last page must correspond with offset', done => {
      usersHelpers.createManyUsersAndAuth().then(({ authorization, totalRows }) => {
        const limit = 5;
        const page = Math.floor(totalRows / limit); // Last page with results
        const offset = totalRows - page * limit;
        chai
          .request(server)
          .get('/users')
          .query({ limit, page })
          .set(sessionManager.HEADER_NAME, authorization)
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
    it('Given a page that overshoot total rows should return an empty array', done => {
      usersHelpers.createManyUsersAndAuth().then(({ authorization, totalRows }) => {
        const limit = 5;
        const page = Math.floor(totalRows / limit) + 1; // First page without results
        chai
          .request(server)
          .get('/users')
          .query({ limit, page })
          .set(sessionManager.HEADER_NAME, authorization)
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
    it('Given a not numeric limit should be unsuccessful', done => {
      usersHelpers.createManyUsersAndAuth().then(({ authorization }) => {
        chai
          .request(server)
          .get('/users')
          .query({ limit: 'string', page: 0 })
          .set(sessionManager.HEADER_NAME, authorization)
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
    it('Given a not numeric page should  be unsuccessful', done => {
      usersHelpers.createManyUsersAndAuth().then(({ authorization }) => {
        chai
          .request(server)
          .get('/users')
          .set(sessionManager.HEADER_NAME, authorization)
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

  describe('POST /users', () => {
    it('Given a valid body should be successful', done => {
      chai
        .request(server)
        .post('/users')
        .send(usersHelpers.fakes.user())
        .then(res => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.have.property('firstName');
          res.body.should.have.property('lastName');
          res.body.should.have.property('email');
          res.body.should.have.property('password');
          dictum.chai(res);
          done();
        })
        .catch(err => done(err));
    });
    it('Given a missing password should be unsuccessful', done => {
      chai
        .request(server)
        .post('/users')
        .send(usersHelpers.fakes.user({ password: undefined }))
        .then(res => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');

          res.body.message[0].message.should.be.equal('"password" is required');
          done();
        })
        .catch(err => done(err));
    });
    it('Given an invalid email should be unsuccessful', done => {
      chai
        .request(server)
        .post('/users')
        .send(usersHelpers.fakes.user({ email: 'email' }))
        .then(res => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');

          res.body.message[0].message.should.be.equal('"email" must be a valid email');
          done();
        })
        .catch(err => done(err));
    });
    it('Given an email without Wolox domain should be unsuccessful', done => {
      chai
        .request(server)
        .post('/users')
        .send(usersHelpers.fakes.user({ email: 'email@other.com.ar' }))
        .then(res => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');

          res.body.message[0].message.should.be.equal(
            '"email" with value "email@other.com.ar" fails to match the Wolox e-mail pattern'
          );
          done();
        })
        .catch(err => done(err));
    });
    it('Given a non-alphanumeric password should be unsuccessful', done => {
      chai
        .request(server)
        .post('/users')
        .send(usersHelpers.fakes.user({ password: 'password' }))
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
    it('Given a shorter-than-8-characters password should be unsuccessful', done => {
      chai
        .request(server)
        .post('/users')
        .send(usersHelpers.fakes.user({ password: 'abc123' }))
        .then(res => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');

          res.body.message[0].message.should.be.equal('"password" length must be at least 8 characters long');
          done();
        })
        .catch(err => done(err));
    });
    it('Given an already created email should be unsuccessful', done => {
      usersHelpers.createUserAndAuth().then(({ user }) => {
        chai
          .request(server)
          .post('/users')
          .send(usersHelpers.fakes.user({ email: user.email }))
          .then(res => {
            res.should.have.status(409);
            res.should.be.json;
            res.body.should.have.property('message');
            res.body.should.have.property('internal_code');

            res.body.message.should.be.equal(`E-mail '${user.email}' already registered`);
            done();
          })
          .catch(err => done(err));
      });
    });
  });
  describe('POST /users/invalidate_all', () => {
    it('Given an admin user token as auth should be succesful and change SECRET', done => {
      const secret = process.env.SECRET;
      usersHelpers.createAdminAndAuth().then(({ authorization }) => {
        chai
          .request(server)
          .post('/users/invalidate_all')
          .set(sessionManager.HEADER_NAME, authorization)
          .send()
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('message');

            secret.should.not.be.equal(process.env.SECRET);

            res.body.message.should.be.equal('All tokens were invalidated');
            done();
          })
          .catch(err => done(err));
      });
    });
    it('Given an admin user token as auth should be succesful and invalidate previous tokens', done => {
      usersHelpers.createAdminAndAuth().then(({ authorization }) => {
        chai
          .request(server)
          .post('/users/invalidate_all')
          .set(sessionManager.HEADER_NAME, authorization)
          .send()
          .then(() => {
            chai
              .request(server)
              .post('/users/invalidate_all')
              .set(sessionManager.HEADER_NAME, authorization)
              .send()
              .then(res => {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.have.property('message');
                res.body.should.have.property('internal_code');

                res.body.message.should.be.equal('invalid signature');
                done();
              });
          })
          .catch(err => done(err));
      });
    });
    it('Given a default user token as auth should be unsuccessful', done => {
      usersHelpers.createUserAndAuth().then(({ user, authorization }) => {
        chai
          .request(server)
          .post('/users/invalidate_all')
          .set(sessionManager.HEADER_NAME, authorization)
          .send()
          .then(res => {
            res.should.have.status(403);
            res.should.be.json;
            res.body.should.have.property('message');
            res.body.should.have.property('internal_code');

            res.body.message.should.be.equal(`User '${user.email}' has not permissions`);
            done();
          })
          .catch(err => done(err));
      });
    });
  });
  describe('POST /users/sessions', () => {
    it('Given an default user and using valid body should be succesful', done => {
      usersHelpers.createUserAndAuth().then(({ user }) => {
        chai
          .request(server)
          .post('/users/sessions')
          .send(usersHelpers.fakes.session({ email: user.email }))
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.headers.should.have.property(sessionManager.HEADER_NAME);
            const { data } = sessionManager.decode(res.headers[sessionManager.HEADER_NAME]);
            data.should.be.equal(user.email);
            dictum.chai(res);
            done();
          })
          .catch(err => done(err));
      });
    });
    it('Given an invalid email should be unsuccesful', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send(usersHelpers.fakes.session({ email: 'email@other.com' }))
        .then(res => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');

          res.body.message[0].message.should.be.equal(
            '"email" with value "email@other.com" fails to match the Wolox e-mail pattern'
          );
          done();
        })
        .catch(err => done(err));
    });
    it('Given an invalid password should be unsuccesful', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send(usersHelpers.fakes.session({ password: 'abc123' }))
        .then(res => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');

          res.body.message[0].message.should.be.equal('"password" length must be at least 8 characters long');
          done();
        })
        .catch(err => done(err));
    });
    it('Given an non-existing email should be unsuccesful', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send(usersHelpers.fakes.session())
        .then(res => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.should.have.property('internal_code');

          res.body.message.should.be.equal(`Cannot find user '${usersHelpers.fakes.session().email}'!`);
          done();
        })
        .catch(err => done(err));
    });
    it('Given an incorrect password should be unsuccesful', done => {
      usersHelpers.createUserAndAuth().then(({ user }) => {
        chai
          .request(server)
          .post('/users/sessions')
          .send(usersHelpers.fakes.session({ email: user.email, password: '123notcorrect' }))
          .then(res => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.have.property('message');
            res.body.should.have.property('internal_code');

            res.body.message.should.be.equal('Email or password are incorrect!');
            done();
          })
          .catch(err => done(err));
      });
    });
  });
  describe('GET /users/:id/albums', () => {
    it('Given an admin should can see all its albums', done => {
      usersHelpers.buyAlbumAsAdmin().then(({ admin, authorization }) =>
        chai
          .request(server)
          .get(`/users/${admin.id}/albums`)
          .set(sessionManager.HEADER_NAME, authorization)
          .send()
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.instanceOf(Array);

            res.body[0].should.have.property('id');
            res.body[0].should.have.property('title');
            res.body[0].should.have.property('albumId');
            res.body[0].should.have.property('createdAt');
            res.body[0].should.have.property('updatedAt');
            res.body[0].should.have.property('deletedAt');
            res.body[0].should.have.property('buyerId');

            dictum.chai(res);
            done();
          })
          .catch(err => done(err))
      );
    });
    it('Given an admin should can see all albums from other user', done => {
      usersHelpers.buyAlbumAsAdmin().then(({ admin }) =>
        usersHelpers.createAdminAndAuth().then(({ authorization }) =>
          chai
            .request(server)
            .get(`/users/${admin.id}/albums`)
            .set(sessionManager.HEADER_NAME, authorization)
            .send()
            .then(res => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.instanceOf(Array);

              res.body.length.should.be.equal(1);

              res.body[0].should.have.property('id');
              res.body[0].should.have.property('title');
              res.body[0].should.have.property('albumId');
              res.body[0].should.have.property('createdAt');
              res.body[0].should.have.property('updatedAt');
              res.body[0].should.have.property('deletedAt');
              res.body[0].should.have.property('buyerId');

              done();
            })
            .catch(err => done(err))
        )
      );
    });
    it('Given a default user should can see all its albums', done => {
      usersHelpers.buyAlbumAsUser().then(({ user, authorization }) =>
        chai
          .request(server)
          .get(`/users/${user.id}/albums`)
          .set(sessionManager.HEADER_NAME, authorization)
          .send()
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.instanceOf(Array);

            res.body[0].should.have.property('id');
            res.body[0].should.have.property('title');
            res.body[0].should.have.property('albumId');
            res.body[0].should.have.property('createdAt');
            res.body[0].should.have.property('updatedAt');
            res.body[0].should.have.property('deletedAt');
            res.body[0].should.have.property('buyerId');

            done();
          })
          .catch(err => done(err))
      );
    });
    it('Given a default user should not can see all albums from other user', done => {
      usersHelpers.buyAlbumAsAdmin().then(({ admin }) =>
        usersHelpers.createUserAndAuth().then(({ user, authorization }) =>
          chai
            .request(server)
            .get(`/users/${admin.id}/albums`)
            .set(sessionManager.HEADER_NAME, authorization)
            .send()
            .then(res => {
              res.should.have.status(403);
              res.should.be.json;
              res.body.message.should.be.equal(`User '${user.email}' has not permissions`);
              done();
            })
            .catch(err => done(err))
        )
      );
    });
    it('Given a non-authenticated request should throw error', done => {
      chai
        .request(server)
        .get(`/users/1/albums`)
        .send()
        .then(res => {
          res.should.have.status(401);
          res.should.be.json;
          res.body.message.should.be.equal(`No authorization provided`);
          done();
        })
        .catch(err => done(err));
    });
    it('Given a non-existing user id should throw error', done => {
      const id = 0;
      usersHelpers.createAdminAndAuth().then(({ authorization }) =>
        chai
          .request(server)
          .get(`/users/${id}/albums`)
          .set(sessionManager.HEADER_NAME, authorization)
          .send()
          .then(res => {
            res.should.have.status(404);
            res.should.be.json;
            res.body.message.should.be.equal(`User #${id} not found`);
            done();
          })
          .catch(err => done(err))
      );
    });
    it('Given a non-valid user id should throw error', done => {
      const id = 'non_valid';
      usersHelpers.createUserAndAuth().then(({ user, authorization }) =>
        chai
          .request(server)
          .get(`/users/${id}/albums`)
          .set(sessionManager.HEADER_NAME, authorization)
          .send()
          .then(res => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.message[0].message.should.be.equal('"userId" must be a number');
            done();
          })
          .catch(err => done(err))
      );
    });
  });
  describe('GET /users/:user_id/albums/:album_id/photos', () => {
    it('Given an admin user should see its album photos', done => {
      usersHelpers.buyAlbumAsAdmin().then(({ admin, albumPurchase, authorization }) => {
        albumPurchasesHelpers.mockPhotosToSuccess(albumPurchase.albumId);
        return chai
          .request(server)
          .get(`/users/${admin.id}/albums/${albumPurchase.albumId}/photos`)
          .set(sessionManager.HEADER_NAME, authorization)
          .send()
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.instanceOf(Array);

            res.body[0].should.have.property('id');
            res.body[0].should.have.property('title');
            res.body[0].should.have.property('albumId');
            res.body[0].should.have.property('url');
            res.body[0].should.have.property('thumbnailUrl');

            dictum.chai(res);
            done();
          })
          .catch(err => done(err));
      });
    });
    it('Given an admin user should not see album photos he has not purchased', done => {
      usersHelpers.createAdminAndAuth().then(({ admin, authorization }) =>
        chai
          .request(server)
          .get(`/users/${admin.id}/albums/10/photos`)
          .set(sessionManager.HEADER_NAME, authorization)
          .send()
          .then(res => {
            res.should.have.status(403);
            res.should.be.json;
            res.body.message.should.be.equal(`User '${admin.email}' has not permissions`);
            done();
          })
          .catch(err => done(err))
      );
    });
    it('Given an admin user should not see album photos from other user', done => {
      usersHelpers.buyAlbumAsUser().then(({ user, albumPurchase }) =>
        usersHelpers.createAdminAndAuth().then(({ admin, authorization }) => {
          albumPurchasesHelpers.mockPhotosToSuccess(albumPurchase.albumId);
          return chai
            .request(server)
            .get(`/users/${user.id}/albums/${albumPurchase.albumId}/photos`)
            .set(sessionManager.HEADER_NAME, authorization)
            .send()
            .then(res => {
              res.should.have.status(403);
              res.should.be.json;
              res.body.message.should.be.equal(`User '${admin.email}' has not permissions`);
              done();
            })
            .catch(err => done(err));
        })
      );
    });
    it('Given an default user should see all its album photos', done => {
      usersHelpers.buyAlbumAsUser().then(({ user, albumPurchase, authorization }) => {
        albumPurchasesHelpers.mockPhotosToSuccess(albumPurchase.albumId);
        return chai
          .request(server)
          .get(`/users/${user.id}/albums/${albumPurchase.albumId}/photos`)
          .set(sessionManager.HEADER_NAME, authorization)
          .send()
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.instanceOf(Array);

            res.body[0].should.have.property('id');
            res.body[0].should.have.property('title');
            res.body[0].should.have.property('albumId');
            res.body[0].should.have.property('url');
            res.body[0].should.have.property('thumbnailUrl');

            dictum.chai(res);
            done();
          })
          .catch(err => done(err));
      });
    });
    it('Given an default user should not see album photos he has not purchased', done => {
      usersHelpers.createUserAndAuth().then(({ user, authorization }) =>
        chai
          .request(server)
          .get(`/users/${user.id}/albums/10/photos`)
          .set(sessionManager.HEADER_NAME, authorization)
          .send()
          .then(res => {
            res.should.have.status(403);
            res.should.be.json;
            res.body.message.should.be.equal(`User '${user.email}' has not permissions`);
            done();
          })
          .catch(err => done(err))
      );
    });
    it('Given an default user should not see album photos from other user', done => {
      usersHelpers.buyAlbumAsAdmin().then(({ admin, albumPurchase }) =>
        usersHelpers.createUserAndAuth().then(({ user, authorization }) => {
          albumPurchasesHelpers.mockPhotosToSuccess(albumPurchase.albumId);
          return chai
            .request(server)
            .get(`/users/${admin.id}/albums/${albumPurchase.albumId}/photos`)
            .set(sessionManager.HEADER_NAME, authorization)
            .send()
            .then(res => {
              res.should.have.status(403);
              res.should.be.json;
              res.body.message.should.be.equal(`User '${user.email}' has not permissions`);
              done();
            })
            .catch(err => done(err));
        })
      );
    });
    it('Given a non-authenticated request should throw error', done => {
      chai
        .request(server)
        .get(`/users/1/albums/1/photos`)
        .send()
        .then(res => {
          res.should.have.status(401);
          res.should.be.json;
          res.body.message.should.be.equal(`No authorization provided`);
          done();
        })
        .catch(err => done(err));
    });
    it('Given a non-valid user id should throw error', done => {
      const id = 'non_valid';
      usersHelpers.createUserAndAuth().then(({ authorization }) =>
        chai
          .request(server)
          .get(`/users/${id}/albums/1/photos`)
          .set(sessionManager.HEADER_NAME, authorization)
          .send()
          .then(res => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.message[0].message.should.be.equal('"userId" must be a number');
            done();
          })
          .catch(err => done(err))
      );
    });
    it('Given a non-valid album id should throw error', done => {
      const id = 'non_valid';
      usersHelpers.createUserAndAuth().then(({ authorization }) =>
        chai
          .request(server)
          .get(`/users/1/albums/${id}/photos`)
          .set(sessionManager.HEADER_NAME, authorization)
          .send()
          .then(res => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.message[0].message.should.be.equal('"albumId" must be a number');
            done();
          })
          .catch(err => done(err))
      );
    });
    it('Given an external API error system should handle it', done => {
      const id = 1;
      albumPurchasesHelpers.mockPhotosToFail(id);
      usersHelpers.buyAlbumAsUser().then(({ albumPurchase, user, authorization }) =>
        chai
          .request(server)
          .get(`/users/${user.id}/albums/${albumPurchase.albumId}/photos`)
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
