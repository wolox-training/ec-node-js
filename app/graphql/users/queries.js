const { GraphQLID, GraphQLList, GraphQLNonNull } = require('graphql');

const User = require('../../services/users');
const { UserType } = require('./types');
const { handleError } = require('../errors');

exports.users = {
  description: 'Return collection of users',
  type: new GraphQLList(UserType),
  args: {},
  resolve: (rootValue, args, ctx, info) => {
    return User.getAll({})
      .then(data => data.rows)
      .catch(handleError(info));
  }
};

exports.user = {
  description: 'Return an user by id',
  type: UserType,
  args: {
    id: { name: 'id', type: new GraphQLNonNull(GraphQLID) }
  },
  resolve: (rootValue, { id }, ctx, info) => {
    return User.find({ id }).catch(handleError(info));
  }
};
