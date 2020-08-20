const Joi = require('joi');

module.exports = {
  retrieveListingPurchaseItemSchema: {
    PARAMS: Joi.object({
      purchaseId: Joi.string().uuid().required(),
    }),
  },

  verifyPickupListingPurchaseItemSchema: {
    PARAMS: Joi.object({
      purchaseId: Joi.string().uuid().required(),
    }),

    BODY: Joi.object({
      code: Joi.string().uuid().required(),
    }),
  },

  cancelListingPurchaseItemSchema: {
    PARAMS: Joi.object({
      purchaseId: Joi.string().uuid().required(),
    }),
  },
};
