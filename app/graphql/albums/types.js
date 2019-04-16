const { GraphQLID, GraphQLInt, GraphQLString, GraphQLNonNull, GraphQLObjectType } = require('graphql');

exports.AlbumType = new GraphQLObjectType({
  name: 'Album',
  fields: {
    id: { name: 'id', type: new GraphQLNonNull(GraphQLID) },
    title: { name: 'title', type: new GraphQLNonNull(GraphQLString) },
    userId: { name: 'userId', type: new GraphQLNonNull(GraphQLInt) }
  }
});
