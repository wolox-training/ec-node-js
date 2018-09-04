const usersController = require('./controllers/users'),
  validations = require('./middlewares/validations'),
  auth = require('./middlewares/auth');

exports.init = app => {
  app.post('/users', [validations.userValidator], usersController.create);
  app.post('/users/sessions', [validations.signinValidator], usersController.signin);
  app.post('/admin/users', [validations.userValidator], usersController.createAdmin);
};
