const winston = require('../loaders/winston');

module.exports = {
  development: {
    use_env_variable: 'DEV_DATABASE_URL',
    logging: (msg) => winston.debug(msg),
    dialect: 'postgres',
  },
  test: {
    use_env_variable: 'TEST_DATABASE_URL',
    logging: false,
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    logging: false,
    dialect: 'postgres',
  },
};
