const Joi = require('joi');

module.exports = {
  retrieveListingRentalItemSchema: {
    PARAMS: Joi.object({
      rentalId: Joi.string().uuid().required(),
    }),
  },

  verifyPickupListingRentalItemSchema: {
    PARAMS: Joi.object({
      rentalId: Joi.string().uuid().required(),
    }),

    BODY: Joi.object({
      code: Joi.string().uuid().required(),
    }),
  },

  verifyReturnListingRentalItemSchema: {
    PARAMS: Joi.object({
      rentalId: Joi.string().uuid().required(),
    }),

    BODY: Joi.object({
      code: Joi.string().uuid().required(),
    }),
  },
};
