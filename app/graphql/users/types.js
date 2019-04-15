const AlbumType = `
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    isAdmin: Boolean!
  }

  type Query {
    users: [User]!
    user(id: ID!): User
  }
`;

module.exports = AlbumType;
