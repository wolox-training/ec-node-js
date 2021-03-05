const usersController = require('./controllers/users');
const albumsController = require('./controllers/albums');
const graphQL = require('./graphql');

const validate = require('./middlewares/validations');
const auth = require('./middlewares/auth');

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
  app.get('/albums', [auth.authenticate], albumsController.getAll);

  app.use('/graphql', [], graphQL.init);
};
