const Joi = require('joi');

module.exports = {
  retrieveListingEnquiryItemSchema: {
    PARAMS: Joi.object({
      enquiryId: Joi.string().uuid().required(),
    }),
  },
};
