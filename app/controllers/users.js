'use strict';

const bcrypt = require('bcryptjs'),
  logger = require('../logger'),
  userService = require('../services/users'),
  errors = require('../errors');

const encryptUserPassword = user =>
  bcrypt.hash(user.password, 10).then(hash => {
    user.password = hash;
    return user;
  });

const encryptAndCreateUser = user => encryptUserPassword(user).then(userService.create);

exports.create = (req, res, next) => {
  const user = req.body;

  userService
    .find({ email: user.email })
    .then(userFound => {
      if (userFound) {
        next(errors.userAlreadyExist(user.email));
      } else {
        encryptAndCreateUser(user).then(created => {
          logger.info(`User #${created.id} with e-mail ${created.email} created succesfully!`);
          res.status(200).send(created);
        });
      }
    })
    .catch(next);
};
