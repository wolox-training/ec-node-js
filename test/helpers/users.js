const sessionManager = require('../../app/services/sessionManager'),
  userFactory = require('../factories/users'),
  albumPurchaseFactory = require('../factories/albumPurchases');

const createAdminAndAuth = (options = {}) =>
  userFactory.create(Object.assign(options, { isAdmin: true })).then(admin => ({
    admin,
    authorization: sessionManager.encode(admin.email)
  }));

const createUserAndAuth = (options = {}) =>
  userFactory.create(options).then(user => ({
    user,
    authorization: sessionManager.encode(user.email)
  }));

const createUserAndAuthExpired = (options = {}) =>
  userFactory.create(options).then(user => ({
    user,
    authorization: sessionManager.encode(user.email, '-1h')
  }));

const authNonExistingUser = () => ({
  authorization: sessionManager.encode('user.deleted@wolox.com.ar')
});

const createManyUsersAndAuth = (totalRows = Math.floor(Math.random() * 100) + 1) => {
  const promises = [];
  for (let index = 0; index < totalRows; index++) {
    promises.push(userFactory.create());
  }

  return Promise.all(promises).then(users => ({
    users,
    totalRows,
    authorization: sessionManager.encode(users[0].email)
  }));
};

const buyAlbumAsUser = () =>
  createUserAndAuth().then(({ user, authorization }) =>
    albumPurchaseFactory.create({ buyerId: user.id }).then(albumPurchase => ({
      user,
      authorization,
      albumPurchase
    }))
  );

const buyAlbumAsAdmin = () =>
  createAdminAndAuth().then(({ admin, authorization }) =>
    albumPurchaseFactory.create({ buyerId: admin.id }).then(albumPurchase => ({
      admin,
      authorization,
      albumPurchase
    }))
  );

const fakes = {
  user: (params = {}) =>
    Object.assign(
      {
        firstName: 'Joe',
        lastName: 'Doe',
        email: 'joe.doe@wolox.com.ar',
        password: 'password1234'
      },
      params
    ),
  session: (params = {}) =>
    Object.assign(
      {
        email: 'joe.doe@wolox.com.ar',
        password: 'password1234'
      },
      params
    )
};

module.exports = {
  authNonExistingUser,
  buyAlbumAsAdmin,
  buyAlbumAsUser,
  createAdminAndAuth,
  createUserAndAuth,
  createUserAndAuthExpired,
  createManyUsersAndAuth,
  fakes
};
