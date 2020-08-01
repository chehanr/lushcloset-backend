const Joi = require('joi');

module.exports = {
  createListingItemSchema: {
    BODY: Joi.object({
      title: Joi.string() // TODO: Make custom error message.
        .regex(/^[\w ]*[^\W_][\w ]*$/) // Letters, numbers and spaces only.
        .max(256)
        .required(),
      description: Joi.string().min(128).required(),
      listingType: Joi.string().valid('rent', 'sell').required(),
      address: Joi.string().required(),
      addressNote: Joi.string().max(256),
      priceValue: Joi.number().positive().required(),
      currencyTypeIso: Joi.string().length(3).uppercase().required(), // Limit to AUD?
    }),
  },

  retrieveListingItemSchema: {
    PARAMS: Joi.object({
      listingId: Joi.string().uuid().required(),
    }),
  },

  updateListingItemSchema: {
    PARAMS: Joi.object({
      listingId: Joi.string().uuid().required(),
    }),
    BODY: Joi.object({
      // title: Joi.string() // TODO: Make custom error message.
      //   .regex(/^[\w ]*[^\W_][\w ]*$/) // Letters, numbers and spaces only.
      //   .max(256)
      //   .required(),
      description: Joi.string().min(128),
      // listingType: Joi.string().valid('rent', 'sell').required(),
      // address: Joi.string(),
      addressNote: Joi.string().max(256),
      priceValue: Joi.number().positive().required(),
      // currencyTypeIso: Joi.string().length(3).uppercase().required(), // Limit to AUD?
    }),
  },
};
