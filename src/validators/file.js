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

  getFilesSchema: {
    QUERY: Joi.object({
      orderBy: Joi.alternatives().try(
        Joi.array().items(
          Joi.valid('createdAt', '-createdAt', 'updatedAt', '-updatedAt')
        ),
        Joi.valid('createdAt', '-createdAt', 'updatedAt', '-updatedAt')
      ),
      filterBy: Joi.alternatives().try(
        Joi.array().items(Joi.valid('isListingImage', 'isUserAvatar')),
        Joi.valid('isListingImage', 'isUserAvatar')
      ),
      limit: Joi.number().positive().allow(0),
      offset: Joi.number().positive().allow(0),
    }),
  },
};
