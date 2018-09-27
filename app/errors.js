const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.EXTERNAL_API_ERROR = 'external_api_error';
exports.externalAPIError = () => internalError('Error consulting external API', exports.EXTERNAL_API_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.REQUEST_ERROR = 'request_error';
exports.requestError = message => internalError(message, exports.REQUEST_ERROR);

exports.NOT_FOUND = 'not_found';
exports.notFound = message => internalError(message, exports.NOT_FOUND);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.INVALID_USER_ERROR = 'invalid_user_error';
exports.invalidUserError = message => internalError(message, exports.INVALID_USER_ERROR);

exports.NOT_PERMISSIONS_ERROR = 'not_permissions_error';
exports.notPermissionsError = message => internalError(message, exports.NOT_PERMISSIONS_ERROR);

exports.UNAUTHORIZED_USER_ERROR = 'unauthorized_user_error';
exports.unauthorizedUserError = message => internalError(message, exports.UNAUTHORIZED_USER_ERROR);

exports.USER_ALREADY_EXIST = 'user_already_exist';
exports.userAlreadyExist = email =>
  internalError(`E-mail '${email}' already registered`, exports.USER_ALREADY_EXIST);
