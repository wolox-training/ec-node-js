'use strict';

const User = require('../models').user,
  errors = require('../errors');

exports.find = where =>
  User.findOne({ where }).catch(err => {
    throw errors.databaseError(err.message);
  });

exports.create = values =>
  User.create(values).catch(err => {
    throw errors.databaseError(err.message);
  });

exports.updateOrCreate = record =>
  User.upsert(record).catch(err => {
    throw errors.databaseError(err.message);
  });

exports.getAll = ({ limit = 5, page = 0 }) =>
  User.findAndCountAll({
    attributes: ['firstName', 'lastName', 'email', 'isAdmin'],
    limit,
    offset: page * limit,
    order: [['id', 'ASC']]
  })
    .then(data => Object.assign({ page }, data))
    .catch(err => {
      throw errors.databaseError(err.message);
    });

exports.count = () =>
  User.count().catch(err => {
    throw errors.databaseError(err.message);
  });
