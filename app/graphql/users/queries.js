const { GraphQLID, GraphQLList, GraphQLNonNull } = require('graphql');

const User = require('../../services/users');
const { UserType } = require('./types');

exports.users = {
  description: 'Return collection of users',
  type: new GraphQLList(UserType),
  args: {},
  resolve: (rootValue, args, context, info) => {
    return User.getAll({}).then(data => data.rows);
  }
};

exports.user = {
  description: 'Return an user by id',
  type: new GraphQLNonNull(UserType),
  args: {
    id: { name: 'id', type: new GraphQLNonNull(GraphQLID) }
  },
  resolve: (rootValue, { id }, context, info) => {
    return User.find({ id });
  }
};
