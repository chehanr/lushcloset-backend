const Joi = require('joi');

module.exports = {
  retrieveListingRentalItemSchema: {
    PARAMS: Joi.object({
      rentalId: Joi.string().uuid().required(),
    }),
  },
};
