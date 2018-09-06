'use strict';

const jwt = require('jwt-simple'),
  config = require('./../../config');

const SECRET = config.common.session.secret;

exports.HEADER_NAME = config.common.session.header_name;

exports.encode = payload => jwt.encode(payload, SECRET);

exports.decode = token => jwt.decode(token, SECRET);
