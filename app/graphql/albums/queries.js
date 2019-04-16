const { GraphQLID, GraphQLList, GraphQLNonNull } = require('graphql');

const Album = require('../../services/albums');
const { AlbumType } = require('./types');

exports.albums = {
  description: 'Return collection of albums',
  type: new GraphQLList(AlbumType),
  args: {},
  resolve: (rootValue, args, context, info) => {
    return Album.getAll();
  }
};

exports.album = {
  description: 'Return an album by id',
  type: new GraphQLNonNull(AlbumType),
  args: {
    id: { name: 'id', type: new GraphQLNonNull(GraphQLID) }
  },
  resolve: (rootValue, { id }, context, info) => {
    return Album.find(id);
  }
};
