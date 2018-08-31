const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.REQUEST_ERROR = 'request_error';
exports.requestError = message => internalError(message, exports.REQUEST_ERROR);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.USER_ALREADY_EXIST = 'user_already_exist';
exports.userAlreadyExist = email =>
  internalError(`E-mail '${email}' already registered`, exports.USER_ALREADY_EXIST);
