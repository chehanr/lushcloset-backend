const Joi = require('joi');

module.exports = {
  retrieveListingEnquiryItemSchema: {
    PARAMS: Joi.object({
      enquiryId: Joi.string().uuid().required(),
    }),
  },

  updateListingEnquiryItemSchema: {
    PARAMS: Joi.object({
      enquiryId: Joi.string().uuid().required(),
    }),
    BODY: Joi.object({
      note: Joi.string().max(256),
    }),
  },

  deleteListingEnquirySchema: {
    PARAMS: Joi.object({
      enquiryId: Joi.string().uuid().required(),
    }),
  },
};
