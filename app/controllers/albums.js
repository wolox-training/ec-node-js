'use strict';

const albumService = require('../services/albums'),
  logger = require('../logger'),
  errors = require('../errors');

exports.getAll = (req, res, next) => {
  albumService
    .getAll()
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      logger.error(err);
      next(errors.defaultError('Something went wrong...'));
    });
};
