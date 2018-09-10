const bcrypt = require('bcryptjs'),
  User = require('../app/models').user;

exports.execute = () => {
  return bcrypt
    .hash('password1234', 10)
    .then(hash => {
      const data = [];
      data.push(
        User.create({
          firstName: 'Joe',
          lastName: 'Doe',
          email: 'joe.doe@wolox.com.ar',
          password: hash
        })
      );
      data.push(
        User.create({
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin.user@wolox.com.ar',
          isAdmin: true,
          password: hash
        })
      );
      return Promise.all(data);
    })
    .catch(bcryptErr => {
      throw bcryptErr;
    });
};
