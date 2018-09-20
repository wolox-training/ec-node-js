'use strict';

const albumService = require('../services/albums'),
  logger = require('../logger'),
  errors = require('../errors');

exports.fetchAll = (req, res, next) => {
  albumService
    .fetchAll()
    .then(data => {
      logger.info('Data fetched from external api succesfully!');
      res.status(200).send(data);
    })
    .catch(err => {
      logger.error(err);
      next(errors.defaultError('Cannot access external API'));
    });
};
