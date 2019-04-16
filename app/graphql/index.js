const expressGraphQL = require('express-graphql');
const schema = require('./schema');

exports.init = expressGraphQL({
  schema,
  graphiql: true
});
