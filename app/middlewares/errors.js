const errors = require('../errors'),
  logger = require('../logger');

const DEFAULT_STATUS_CODE = 500;

const statusCodes = {
  [errors.DATABASE_ERROR]: 503,
  [errors.EXTERNAL_API_ERROR]: 503,
  [errors.DEFAULT_ERROR]: 500,
  [errors.USER_ALREADY_EXIST]: 409,
  [errors.NOT_FOUND]: 404,
  [errors.NOT_PERMISSIONS_ERROR]: 403,
  [errors.UNAUTHORIZED_USER_ERROR]: 401,
  [errors.INVALID_USER_ERROR]: 400,
  [errors.REQUEST_ERROR]: 400
};

exports.handle = (error, req, res, next) => {
  if (error.internalCode) {
    res.status(statusCodes[error.internalCode] || DEFAULT_STATUS_CODE);
  } else {
    // Unrecognized error, notifying it to rollbar.
    next(error);
    res.status(DEFAULT_STATUS_CODE);
  }
  logger.error(error);
  return res.send({ message: error.message, internal_code: error.internalCode });
};
