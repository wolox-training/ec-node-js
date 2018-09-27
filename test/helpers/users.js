const sessionManager = require('../../app/services/sessionManager'),
  userFactory = require('../factories/users'),
  albumPurchaseFactory = require('../factories/albumPurchases');

exports.createAdminAndAuth = (options = {}) =>
  userFactory.create(Object.assign(options, { isAdmin: true })).then(admin => ({
    admin,
    authorization: sessionManager.encode(admin.email)
  }));

exports.createUserAndAuth = (options = {}) =>
  userFactory.create(Object.assign(options)).then(user => ({
    user,
    authorization: sessionManager.encode(user.email)
  }));

exports.createUserAndAuthExpired = (options = {}) =>
  userFactory.create(options).then(user => ({
    user,
    authorization: sessionManager.encode(user.email, '-1h')
  }));

exports.authNonExistingUser = () => ({
  authorization: sessionManager.encode('user.deleted@wolox.com.ar')
});

exports.createManyUsersAndAuth = (totalRows = Math.floor(Math.random() * 100) + 1) => {
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

exports.buyAlbumAsUser = () =>
  exports.createUserAndAuth().then(({ user, authorization }) =>
    albumPurchaseFactory.create({ buyerId: user.id }).then(albumPurchase => ({
      user,
      authorization,
      albumPurchase
    }))
  );
exports.buyAlbumAsAdmin = () =>
  exports.createAdminAndAuth().then(({ admin, authorization }) =>
    albumPurchaseFactory.create({ buyerId: admin.id }).then(albumPurchase => ({
      admin,
      authorization,
      albumPurchase
    }))
  );

exports.fakes = {
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
