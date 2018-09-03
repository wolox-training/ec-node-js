const usersController = require('./controllers/users'),
  validations = require('./middlewares/validations');

exports.init = app => {
  app.post('/users', [validations.userValidator], usersController.create);
};
