'use strict';

const jwt = require('jsonwebtoken'),
  secretGenerator = require('./secretGenerator'),
  jwtConfig = require('./../../config').common.session;

const secret = () => secretGenerator.getGlobalSecret();

exports.HEADER_NAME = jwtConfig.headerName;

exports.encode = (data, expiresIn = jwtConfig.expirationTime) => jwt.sign({ data }, secret(), { expiresIn });

exports.decode = token => jwt.verify(token, secret());
