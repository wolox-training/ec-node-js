const usersController = require('./controllers/users'),
  albumsController = require('./controllers/albums'),
  validate = require('./middlewares/validations'),
  accessControl = require('./middlewares/accessControl'),
  auth = require('./middlewares/auth');

exports.init = app => {
  app.get('/users', [auth.authenticate, validate.pagination], usersController.getUsers);
  app.post('/users', [validate.createUser], usersController.create);
  app.post('/users/sessions', [validate.signin], usersController.signin);
  app.post(
    '/users/invalidate_all',
    [auth.authenticate, accessControl.requireAccessLevel('admin')],
    usersController.invalidateAllTokens
  );
  app.get(
    '/users/:userId/albums',
    [auth.authenticate, validate.params, accessControl.requireAccessLevel('ownerOrAdmin')],
    usersController.listAlbums
  );
  app.post(
    '/admin/users',
    [auth.authenticate, accessControl.requireAccessLevel('admin'), validate.createAdmin],
    usersController.createAdmin
  );
  app.get('/albums', [auth.authenticate], albumsController.fetchAll);
  app.post('/albums/:albumId', [auth.authenticate, validate.params], albumsController.purchaseAlbum);
  app.get(
    '/users/:userId/albums/:albumId/photos',
    [auth.authenticate, validate.params, accessControl.requireAccessLevel('owner')],
    albumsController.listPurchasedAlbumPhotos
  );
};
