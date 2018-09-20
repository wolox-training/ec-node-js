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

const permissions = {
  isAdmin: user => user.isAdmin,
  isOwner: (user, ownerId) => user.id === Number(ownerId),
  isOwnerOrAdmin: (user, ownerId) => user.isAdmin || user.id === Number(ownerId)
};

exports.permissions = validation => (req, res, next) => {
  const user = req.user,
    ownerId = req.params.userId;

  if (permissions[validation](user, ownerId)) {
    next();
  } else {
    next(errors.notPermissionsError(`User '${user.email}' has not permissions`));
  }
};
