const sessionManager = require('../../app/services/sessionManager');

exports.example = {
  firstName: 'Anna',
  lastName: 'Rose',
  password: 'password1234',
  email: 'anna.rose@wolox.com.ar'
};

exports.defaultUser = () => sessionManager.encode('joe.doe@wolox.com.ar');

exports.deletedUser = () => sessionManager.encode('user.deleted@wolox.com.ar');

exports.adminUser = () => sessionManager.encode('admin.user@wolox.com.ar');

exports.expiredUser = () => sessionManager.encode('joe.doe@wolox.com.ar', '-1h');
