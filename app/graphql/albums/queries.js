const { GraphQLID, GraphQLList, GraphQLNonNull } = require('graphql');

const Album = require('../../services/albums');
const { AlbumType } = require('./types');
const { handleError } = require('../errors');

exports.albums = {
  description: 'Return collection of albums',
  type: new GraphQLList(AlbumType),
  args: {},
  resolve: (rootValue, args, ctx, info) => {
    return Album.getAll().catch(handleError(info));
  }
};

exports.album = {
  description: 'Return an album by id',
  type: new GraphQLNonNull(AlbumType),
  args: {
    id: { name: 'id', type: new GraphQLNonNull(GraphQLID) }
  },
  resolve: (rootValue, { id }, ctx, info) => {
    return Album.find(id).catch(handleError(info));
  }
};
