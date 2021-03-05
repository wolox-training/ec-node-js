const expressGraphQL = require('express-graphql');
const schema = require('./schema');
const { customFormatErrorHandler } = require('./errors');

exports.init = (req, res) =>
  expressGraphQL({
    schema,
    graphiql: true,
    formatError: customFormatErrorHandler(req, res) // formatError is deprecated
  })(req, res);
