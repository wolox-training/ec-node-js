'use strict';

const errors = require('../errors');

const verifyAccessLevel = {
  admin: user => user.isAdmin,
  owner: (user, resourceOwnerId) => user.id === Number(resourceOwnerId),
  ownerOrAdmin: (user, resourceOwnerId) => user.isAdmin || user.id === Number(resourceOwnerId)
};

exports.requireAccessLevel = accessLevel => (req, res, next) => {
  const user = req.user,
    resourceOwnerId = req.params.userId;
  verifyAccessLevel[accessLevel](user, resourceOwnerId)
    ? next()
    : next(errors.notPermissionsError(`User '${user.email}' has not permissions`));
};
