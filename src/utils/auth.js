const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const serverConfig = require('../configs/server');

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
  hashPassword: async (plainTextPwd) => {
    return bcrypt.hash(plainTextPwd, serverConfig.bcryptSaltRounds);
  },

  /**
   * Check if hashed password matches.
   * @param  {String} plainTextPwd Plain text password.
   * @param  {String} hashPwd      Hashed value.
   * @return {Boolean}             result.
   */
  matchPassword: async (plainTextPwd, hashPwd) => {
    return bcrypt.compare(plainTextPwd, hashPwd);
  },
};
