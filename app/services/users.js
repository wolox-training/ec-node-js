'use strict';

const User = require('../models').user,
  errors = require('../errors');

exports.create = values =>
  User.create(values).catch(err => {
    throw errors.databaseError(err.message);
  });

exports.update = user =>
  User.upsert(user).catch(err => {
    throw errors.databaseError(err.message);
  });

exports.find = where =>
  User.findOne({ where }).catch(err => {
    throw errors.databaseError(err.message);
  });
