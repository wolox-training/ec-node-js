const models = require('../app/models'),
  { users } = require('../fixtures');

exports.execute = () => Promise.all([models.user.bulkCreate(users)]);
