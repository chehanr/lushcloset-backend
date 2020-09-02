const Joi = require('joi');

module.exports = {
  getUserSchema: {
    PARAMS: Joi.object({
      userId: Joi.string().uuid().required(),
    }),
  },
};
