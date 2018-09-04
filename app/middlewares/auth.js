const sessionManager = require('../services/sessionManager'),
  usersService = require('../services/users'),
  logger = require('../logger');

exports.authenticate = (req, res, next) => {
  const hash = req.headers[sessionManager.HEADER_NAME];
  if (hash) {
    const email = sessionManager.decode(hash);
    usersService
      .find({ email })
      .then(found => {
        if (found) {
          req.user = found;
          next();
        }
      })
      .catch(err => {
        logger.error('Error verifying hash', err);
        res.status(401).end();
      });
  }
  res.status(401).end();
};
