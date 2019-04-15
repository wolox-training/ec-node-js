'use strict';

const User = require('../../services/users');

module.exports = {
  queries: {
    user: (rootValue, { id }, context, info) => {
      return User.find({ id });
    },
    users: () => {
      return User.getAll({}).then(data => data.rows);
    }
  }
};
