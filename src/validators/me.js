const Joi = require('joi');

module.exports = {
  getMeSchema: {},

  updateMeSchema: {
    BODY: Joi.object({
      name: Joi.string().max(256),
    }),
  },

  createAvatarSchema: {
    BODY: Joi.object({
      fileId: Joi.string().uuid().required(),
    }),
  },
};
