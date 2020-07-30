const passport = require('passport');

const authController = require('../controllers/auth');

module.exports = {
  authRequired(req, res, next) {
    passport.authenticate('jwt', { session: false }, (error, user) => {
      if (error) return authController.fail(res, error);
      if (!user) return authController.notAuthenticated(req, res);

      req.user = user;

      return next();
    })(req, res, next);
  },

  authOptional(req, res, next) {
    passport.authenticate('jwt', { session: false }, (error, user) => {
      if (error) return authController.fail(res, error);

      req.user = user;

      return next();
    })(req, res, next);
  },
};
