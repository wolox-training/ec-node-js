const albums = require('./albums/resolvers');
const users = require('./users/resolvers');

module.exports = {
  Query: {
    ...albums.queries,
    ...users.queries
  },
  Mutation: {
    ...albums.mutations
  }
};
