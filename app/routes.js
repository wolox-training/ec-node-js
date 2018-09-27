const usersController = require('./controllers/users'),
  albumsController = require('./controllers/albums'),
  validate = require('./middlewares/validations'),
  auth = require('./middlewares/auth');

exports.init = app => {
  app.get('/users', [auth.authenticate, validate.pagination], usersController.getUsers);
  app.post('/users', [validate.createUser], usersController.create);
  app.post('/users/sessions', [validate.signin], usersController.signin);
  app.post('/users/invalidate_all', [auth.authenticate, auth.isAdmin], usersController.invalidateAllTokens);
  app.post(
    '/admin/users',
    [auth.authenticate, auth.isAdmin, validate.createAdmin],
    usersController.createAdmin
  );
  app.get('/albums', [auth.authenticate], albumsController.fetchAll);
  app.post('/albums/:albumId', [auth.authenticate, validate.params], albumsController.purchaseAlbum);
};
