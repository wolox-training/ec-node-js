'use strict';

const bcrypt = require('bcryptjs'),
  logger = require('../logger'),
  userService = require('../services/users'),
  sessionManager = require('../services/sessionManager'),
  secretGenerator = require('../services/secretGenerator'),
  errors = require('../errors'),
  config = require('../../config').common.session;

const SALT_ROUND = 10;

const encryptUserPassword = user =>
  bcrypt.hash(user.password, SALT_ROUND).then(password => Object.assign(user, { password }));

const encryptAndCreateUser = user => encryptUserPassword(user).then(userService.create);

const create = (req, res, next) => {
  const user = req.body;

  userService
    .find({ email: user.email })
    .then(userFound => {
      if (userFound) {
        next(errors.userAlreadyExist(user.email));
      } else {
        encryptAndCreateUser(user).then(created => {
          logger.info(`User #${created.id} with e-mail ${created.email} created succesfully!`);
          res.status(201).send(created);
        });
      }
    })
    .catch(next);
};

const createAdmin = (req, res, next) => {
  const user = req.body;
  encryptUserPassword(user).then(hashedUser => {
    hashedUser.isAdmin = true;
    userService
      .updateOrCreate(hashedUser)
      .then(created => {
        if (created) {
          logger.info(`Admin with e-mail ${hashedUser.email} created succesfully!`);
          res.status(201).send(hashedUser);
        } else {
          logger.info(`User with e-mail ${hashedUser.email} is now admin!`);
          res.status(200).send(hashedUser);
        }
      })
      .catch(next);
  });
};

const signin = (req, res, next) => {
  const { email, password } = req.body;

  userService
    .find({ email })
    .then(userFound => {
      if (userFound) {
        bcrypt.compare(password, userFound.password).then(valid => {
          if (valid) {
            const payload = sessionManager.encode(userFound.email);
            res.set(sessionManager.HEADER_NAME, payload);
            logger.info(`User ${userFound.email} signed in`);
            res.status(200).send({
              msg: `User ${userFound.email} signed in correctly!`,
              expirationTime: config.expirationTime
            });
          } else {
            next(errors.invalidUserError(`Email or password are incorrect!`));
          }
        });
      } else {
        next(errors.invalidUserError(`Cannot find user ${email}!`));
      }
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  const { limit, page } = req.query;

  return userService
    .getAll({ limit, page })
    .then(data => res.status(200).send(data))
    .catch(next);
};

const invalidateAllTokens = (req, res, next) => {
  secretGenerator.setGlobalSecret();
  res.status(200).send({ message: 'All tokens were invalidated' });
};

module.exports = {
  getUsers,
  create,
  createAdmin,
  signin,
  invalidateAllTokens
};
