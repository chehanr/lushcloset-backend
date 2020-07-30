const Joi = require('joi');

module.exports = {
  retrieveUserItemSchema: {
    PARAMS: Joi.object({
      userId: Joi.string().uuid().required(),
    }),
  },
  updateUserItemSchema: {
    PARAMS: Joi.object({
      userId: Joi.string().uuid().required(),
    }),
    BODY: Joi.object({
      name: Joi.string().max(256),
    }),
  },
};
