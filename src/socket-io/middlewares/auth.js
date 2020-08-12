const passport = require('passport');

module.exports = {
  authRequired(socket, next) {
    passport.authenticate(
      'jwt-socket-io',
      { session: false },
      (error, user) => {
        if (error) return next(new Error('Internal server error'));
        if (!user) return next(new Error('Not authenticated'));

        // eslint-disable-next-line no-param-reassign
        socket.user = user;

        return next();
      }
    )(socket, next);
  },
};
