const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const albums = require('./albums');
const users = require('./users');

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      ...albums.queries,
      ...users.queries
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...albums.mutations
    }
  })
});
