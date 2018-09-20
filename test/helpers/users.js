const sessionManager = require('../../app/services/sessionManager'),
  factory = require('../factories/users');

const createAdminAndAuth = (options = {}) =>
  factory.create(Object.assign(options, { isAdmin: true })).then(admin => ({
    admin,
    authorization: sessionManager.encode(admin.email)
  }));

const createUserAndAuth = (options = {}) =>
  factory.create(options).then(user => ({
    user,
    authorization: sessionManager.encode(user.email)
  }));

const createUserAndAuthExpired = (options = {}) =>
  factory.create(options).then(user => ({
    user,
    authorization: sessionManager.encode(user.email, '-1h')
  }));

const authNonExistingUser = () => ({
  authorization: sessionManager.encode('user.deleted@wolox.com.ar')
});

const createManyUsersAndAuth = (totalRows = Math.floor(Math.random() * 100) + 1) => {
  const promises = [];
  for (let index = 0; index < totalRows; index++) {
    promises.push(factory.create());
  }

  return Promise.all(promises).then(users => ({
    users,
    totalRows,
    authorization: sessionManager.encode(users[0].email)
  }));
};

const fakes = {
  user: (params = {}) =>
    Object.assign(
      {
        firstName: 'Anna',
        lastName: 'Rose',
        email: 'anna.rose@wolox.com.ar',
        password: 'password1234'
      },
      params
    ),
  session: (params = {}) =>
    Object.assign(
      {
        email: 'anna.rose@wolox.com.ar',
        password: 'password1234'
      },
      params
    )
};

module.exports = {
  createAdminAndAuth,
  createUserAndAuth,
  createUserAndAuthExpired,
  authNonExistingUser,
  createManyUsersAndAuth,
  fakes
};
