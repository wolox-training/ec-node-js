exports.config = {
  environment: 'testing',
  isTesting: true,
  common: {
    database: {
      name: process.env.DB_NAME_TEST
    },
    session: {
      expirationTime: process.env.NODE_API_SESSION_EXP_TIME_TEST
    }
  }
};
