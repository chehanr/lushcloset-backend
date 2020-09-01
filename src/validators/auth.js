const Joi = require('joi');

module.exports = {
  createLocalUserItemSchema: {
    BODY: Joi.object({
      name: Joi.string().max(256).required(),
      email: Joi.string().email().required(),
      password: Joi.string().max(128).required(),
    }),
  },
  retrieveLocalUserItemSchema: {
    BODY: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().max(128).required(),
    }),
  },
  verifyEmailSchema: {
    QUERY: Joi.object({
      userId: Joi.string().uuid().required(),
      token: Joi.string()
        .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
        .required(),
    }),
  },
  resendVerifyEmailSchema: {},
};
