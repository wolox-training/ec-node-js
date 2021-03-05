const { GraphQLID, GraphQLString, GraphQLNonNull, GraphQLObjectType, GraphQLBoolean } = require('graphql');

exports.UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { name: 'id', type: new GraphQLNonNull(GraphQLID) },
    firstName: { name: 'firstName', type: new GraphQLNonNull(GraphQLString) },
    lastName: { name: 'lastName', type: new GraphQLNonNull(GraphQLString) },
    email: { name: 'email', type: new GraphQLNonNull(GraphQLString) },
    isAdmin: { name: 'isAdmin', type: new GraphQLNonNull(GraphQLBoolean) }
  }
});
