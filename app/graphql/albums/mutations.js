const { GraphQLInt, GraphQLID, GraphQLBoolean, GraphQLNonNull, GraphQLString } = require('graphql');

const Album = require('../../services/albums');
const { AlbumType, NewAlbumInputType } = require('./types');

exports.addAlbum = {
  description: 'Creates a new album',
  type: new GraphQLNonNull(AlbumType),
  args: {
    newAlbum: { name: 'newAlbum', type: NewAlbumInputType }
  },
  resolve: (rootValue, { newAlbum }, context, info) => {
    const { title, userId } = newAlbum;
    return Album.create({ title, userId });
  }
};

exports.editAlbum = {
  description: 'Edits an album',
  type: new GraphQLNonNull(AlbumType),
  args: {
    id: { name: 'id', type: new GraphQLNonNull(GraphQLID) },
    title: { name: 'title', type: GraphQLString },
    userId: { name: 'userId', type: GraphQLInt }
  },
  resolve: (rootValue, { id, ...args }, context, info) => {
    return Album.update(id, { ...args });
  }
};

exports.deleteAlbum = {
  description: 'Deletes an album by id',
  type: GraphQLBoolean,
  args: {
    id: { name: 'id', type: new GraphQLNonNull(GraphQLID) }
  },
  resolve: (rootValue, { id }, context, info) => {
    return Album.delete(id);
  }
};
