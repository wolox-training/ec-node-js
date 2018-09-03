'use strict';

const fs = require('fs'),
  path = require('path'),
  chai = require('chai'),
  chaiHttp = require('chai-http'),
  models = require('../app/models'),
  dataCreation = require('../scripts/dataCreation');

chai.use(chaiHttp);

const truncateTable = model =>
  model.destroy({ truncate: true, cascade: true, force: true, restartIdentity: true });

const truncateDatabase = () => Promise.all(Object.values(models.sequelize.models).map(truncateTable));

beforeEach('drop tables, re-create them and populate sample data', done => {
  truncateDatabase()
    .then(() => dataCreation.execute())
    .then(() => done());
});

// including all test files
const normalizedPath = path.join(__dirname, '.');

const requireAllTestFiles = pathToSearch => {
  fs.readdirSync(pathToSearch).forEach(file => {
    if (fs.lstatSync(`${pathToSearch}/${file}`).isDirectory()) {
      requireAllTestFiles(`${pathToSearch}/${file}`);
    } else {
      require(`${pathToSearch}/${file}`);
    }
  });
};

requireAllTestFiles(normalizedPath);
