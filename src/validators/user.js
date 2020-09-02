const Joi = require('joi');

module.exports = {
  retrieveUserItemSchema: {
    PARAMS: Joi.object({
      userId: Joi.string().uuid().required(),
    }),
  },
};
