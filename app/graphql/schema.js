const { mergeTypes } = require('merge-graphql-schemas');
const Album = require('./albums/types');
const User = require('./users/types');

const typeDefs = [Album, User];

module.exports = mergeTypes(typeDefs, { all: true });
