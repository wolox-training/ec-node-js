'use strict';

const faker = require('faker'),
  User = require('../../app/models').user;

const data = (props = {}) =>
  Object.assign(
    {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(null, null, 'wolox.com.ar'),
      password: '$2a$10$IJIppwfGFzCVq7INsHERVeVbhmmh3WV1B6cMjy74yYGk8mtEeBcHC', // password1234
      isAdmin: false
    },
    props
  );

exports.create = props => User.create(data(props));
