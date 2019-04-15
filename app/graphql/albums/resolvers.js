'use strict';

const Album = require('../../services/albums');

module.exports = {
  queries: {
    album: (rootValue, { id }, context, info) => {
      return Album.find(id);
    },
    albums: () => {
      return Album.getAll();
    }
  },
  mutations: {
    addAlbum: (rootValue, { title, userId }, context, info) => {
      return Album.create({ title, userId });
    },
    editAlbum: (rootValue, { id, ...args }, context, info) => {
      return Album.update(id, { ...args });
    },
    deleteAlbum: (rootValue, { id }, context, info) => {
      return Album.delete(id);
    }
  }
};
