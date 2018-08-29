const config = require('../config').common.database;

module.exports = {
  development: {
    username: config.username,
    password: config.password,
    database: config.name,
    host: config.host,
    operatorsAliases: config.operatorsAliases,
    dialect: 'postgres',
    logging: console.log // eslint-disable-line no-console
  },
  testing: {
    username: config.username,
    password: config.password,
    database: config.name,
    host: config.host,
    operatorsAliases: config.operatorsAliases,
    dialect: 'postgres',
    logging: console.log // eslint-disable-line no-console
  },
  production: {
    username: config.username,
    password: config.password,
    database: config.name,
    host: config.host,
    operatorsAliases: config.operatorsAliases,
    dialect: 'postgres',
    logging: false
  }
};
