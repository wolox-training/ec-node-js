const {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType
} = require('graphql');

exports.AlbumType = new GraphQLObjectType({
  name: 'Album',
  fields: {
    id: { name: 'id', type: new GraphQLNonNull(GraphQLID) },
    title: { name: 'title', type: new GraphQLNonNull(GraphQLString) },
    userId: { name: 'userId', type: new GraphQLNonNull(GraphQLInt) }
  }
});

exports.NewAlbumInputType = new GraphQLInputObjectType({
  name: 'NewAlbumInput',
  fields: {
    title: { name: 'title', type: new GraphQLNonNull(GraphQLString) },
    userId: { name: 'userId', type: GraphQLInt }
  }
});
