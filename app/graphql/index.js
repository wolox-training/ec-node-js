const expressGraphQL = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

exports.init = expressGraphQL({
  schema,
  graphiql: true
});
