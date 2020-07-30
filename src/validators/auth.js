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
};
