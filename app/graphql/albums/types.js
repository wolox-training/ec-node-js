const AlbumType = `
  type Album {
    id: ID!
    userId: Int!
    title: String!
  }

  type Query {
    albums: [Album]!
    album(id: ID!): Album
  }

  type Mutation {
    addAlbum(title: String!, userId: Int): Album!
    editAlbum(id: ID!, title: String, userId: Int): Album!
    deleteAlbum(id: ID!): Boolean 
  }
`;

module.exports = AlbumType;
