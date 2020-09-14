const jsonwebtoken = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const serverConfig = require('../configs/server');
const logger = require('../loaders/winston');

module.exports = {
  /**
   * Returns a JWT for a user object.
   * @param  {Object} userObj User object.
   * @return {String}         JWT token.
   */
  generateJwt: (userObj) => {
    return jsonwebtoken.sign(userObj, serverConfig.jwtSecret, {
      expiresIn: serverConfig.jwtExpirationTime,
      algorithm: 'HS256',
    });
  },

  /**
   * Returns a bcrypt password hash.
   * @param  {String} plainTextPwd Password.
   * @return {String}              Hash.
   */
  hashPassword: (plainTextPwd) => {
    return new Promise((resolve, reject) => {
      bcryptjs.hash(
        plainTextPwd,
        serverConfig.bcryptSaltRounds,
        (error, hash) => {
          if (error) {
            return reject(error);
          }

          return resolve(hash);
        }
      );
    }).catch((error) => {
      logger.error(error);
    });
  },

  /**
   * Check if hashed password matches.
   * @param  {String} plainTextPwd Plain text password.
   * @param  {String} hashPwd      Hashed value.
   * @return {Boolean}             result.
   */
  matchPassword: (plainTextPwd, hashPwd) => {
    return new Promise((resolve, reject) => {
      bcryptjs.compare(plainTextPwd, hashPwd, (error, isSuccess) => {
        if (error) {
          return reject(error);
        }

        return resolve(isSuccess);
      });
    }).catch((error) => {
      logger.error(error);
      return false;
    });
  },
};