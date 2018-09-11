const sessionManager = require('../services/sessionManager'),
  usersService = require('../services/users'),
  errors = require('../errors'),
  logger = require('../logger');

exports.authenticate = (req, res, next) => {
  const hash = req.headers[sessionManager.HEADER_NAME];
  if (hash) {
    try {
      const email = sessionManager.decode(hash);
      usersService.find({ email }).then(found => {
        if (found) {
          req.user = found;
          next();
        }
      });
    } catch (error) {
      next(errors.unauthorizedUserError('Error verifying hash'));
    }
  } else {
    next(errors.unauthorizedUserError('No authorization provided'));
  }
};

exports.isAdmin = (req, res, next) => {
  const user = req.user;
  if (user.isAdmin) {
    next();
  } else {
    next(errors.notPermissionsError(`User ${user.email} is not Admin`));
  }
};