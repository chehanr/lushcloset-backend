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

  retrieveListingListSchema: {
    QUERY: Joi.object({
      orderBy: Joi.alternatives().try(
        Joi.array().items(
          Joi.valid(
            'priceValue',
            '-priceValue',
            'createdAt',
            '-createdAt',
            'updatedAt',
            '-updatedAt'
          )
        ),
        Joi.valid(
          'priceValue',
          '-priceValue',
          'createdAt',
          '-createdAt',
          'updatedAt',
          '-updatedAt'
        )
      ),
      filterBy: Joi.alternatives().try(
        Joi.array().items(
          Joi.valid(
            'isRentable',
            'isPurchasable',
            'isAvailable',
            '-isAvailable'
          )
        ),
        Joi.valid('isRentable', 'isPurchasable', 'isAvailable', '-isAvailable')
      ),
      titleiLike: Joi.string(),
      priceGte: Joi.number(),
      priceLte: Joi.number(),
      currencyTypeIso: Joi.string().length(3).uppercase(), // Limit to AUD?
      limit: Joi.number().positive().allow(0),
      offset: Joi.number().positive().allow(0),
    }),
  },

  updateListingItemSchema: {
    PARAMS: Joi.object({
      listingId: Joi.string().uuid().required(),
    }),
    BODY: Joi.object({
      // title: Joi.string() // TODO: Make custom error message.
      //   .regex(/^[\w ]*[^\W_][\w ]*$/) // Letters, numbers and spaces only.
      //   .max(256),
      description: Joi.string().min(128),
      // listingType: Joi.string().valid('rent', 'sell'),
      // address: Joi.string(),
      addressNote: Joi.string().max(256),
      priceValue: Joi.number().positive(),
      // currencyTypeIso: Joi.string().length(3).uppercase(), // Limit to AUD?
    }),
  },

  deleteListingItemSchema: {
    PARAMS: Joi.object({
      listingId: Joi.string().uuid().required(),
    }),
  },

  createListingItemListingEnquiryItemSchema: {
    PARAMS: Joi.object({
      listingId: Joi.string().uuid().required(),
    }),

    BODY: Joi.object({
      note: Joi.string().max(256),
    }),
  },

  retrieveListingItemListingEnquiryListSchema: {
    PARAMS: Joi.object({
      listingId: Joi.string().uuid().required(),
    }),
    QUERY: Joi.object({
      orderBy: Joi.alternatives().try(
        Joi.array().items(
          Joi.valid('createdAt', '-createdAt', 'updatedAt', '-updatedAt')
        ),
        Joi.valid('createdAt', '-createdAt', 'updatedAt', '-updatedAt')
      ),
      filterBy: Joi.alternatives().try(
        Joi.array().items(
          Joi.valid('IsPending', 'IsAccepted', 'isRejected', 'isCompleted')
        ),
        Joi.valid('IsPending', 'IsAccepted', 'isRejected', 'isCompleted')
      ),
      limit: Joi.number().positive().allow(0),
      offset: Joi.number().positive().allow(0),
    }),
  },
};
