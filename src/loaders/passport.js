const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const serverConfig = require('../configs/server');
const models = require('../models');

passport.serializeUser((user, done) => {
  if (user) return done(null, user.id);

  return done(null, false);
});

passport.deserializeUser(async (id, done) => {
  try {
    const userObj = await models.User.findByPk(id);

    if (userObj) return done(null, userObj);

    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
});

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: serverConfig.jwtSecret,
    },
    async (jwtPayload, done) => {
      try {
        const userObj = await models.User.findByPk(jwtPayload.user.id);

        if (userObj) return done(null, userObj);

        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

module.exports = passport;
