const crypto = require('crypto');

const generateRandomString = () => Math.ceil(Date.now() * Math.random()).toString();

const generateSecret = () =>
  crypto
    .createHash('md5')
    .update(generateRandomString())
    .digest('hex');

exports.setGlobalSecret = () => {
  process.env.SECRET = generateSecret();
  return process.env.SECRET;
};

exports.getGlobalSecret = () => process.env.SECRET;
