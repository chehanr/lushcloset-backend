const Joi = require('joi');

module.exports = {
  createFileSchema: {
    FILES: Joi.object({
      file: Joi.object({
        size: Joi.number()
          .positive()
          .max(1 * 1024 * 1024),
        type: Joi.string().valid('image/jpeg'), // Only accepts jpegs for now.
      }).required(),
    }),

    BODY: Joi.object({
      purpose: Joi.string().valid('listing_image', 'user_avatar').required(),
    }),
  },

  getFileSchema: {
    PARAMS: Joi.object({
      fileId: Joi.string().uuid().required(),
    }),
  },
};
