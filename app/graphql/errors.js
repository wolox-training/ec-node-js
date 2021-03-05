const { GraphQLError } = require('graphql');
const logger = require('../logger');

const DEFAULT_STATUS_CODE = 500;

exports.handleError = info => originalError => {
  logger.error(originalError);
  const { statusCode, message } = originalError;
  const resource = info.fieldName;
  const errorMessage = `Received error with message [${message}] for resource [${resource}]`;

  const graphQLError = new GraphQLError(errorMessage);
  graphQLError.status = statusCode;

  throw graphQLError;
};

exports.customFormatErrorHandler = (_, res) => graphqlError => {
  const { message, status } = graphqlError.originalError || graphqlError;

  res.statusCode = status || DEFAULT_STATUS_CODE;
  logger.error(graphqlError.stack);
  return message || graphqlError.message;
};
