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
