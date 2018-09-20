const sessionManager = require('../services/sessionManager'),
  usersService = require('../services/users'),
  errors = require('../errors');

exports.authenticate = (req, res, next) => {
  const hash = req.headers[sessionManager.HEADER_NAME];
  if (hash) {
    try {
      const email = sessionManager.decode(hash).data;
      usersService.find({ email }).then(found => {
        if (found) {
          req.user = found;
          next();
        } else {
          next(errors.unauthorizedUserError('Error checking token'));
        }
      });
    } catch (error) {
      next(errors.unauthorizedUserError(error.message));
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
    next(errors.notPermissionsError(`User '${user.email}' is not Admin`));
  }
};

exports.isOwnerOrAdmin = (req, res, next) => {
  const user = req.user,
    ownerId = Number(req.params.userId);

  if (user.isAdmin || user.id === ownerId) {
    next();
  } else {
    next(errors.notPermissionsError(`User '${user.email}' has no access`));
  }
};
