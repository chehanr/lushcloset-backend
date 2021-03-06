const Joi = require('joi');

const {
  LISTING_TITLE_BODY,
  ORDER_BY_LAT_LNG_QUERY,
} = require('../constants/regex');

module.exports = {
  createListingSchema: {
    BODY: Joi.object({
      title: Joi.string() // TODO: Make custom error message.
        .regex(LISTING_TITLE_BODY)
        .max(256)
        .required(),
      description: Joi.string().min(128).required(),
      listingType: Joi.string().valid('rent', 'sell').required(),
      address: Joi.string().required(),
      addressNote: Joi.string().max(256),
      priceValue: Joi.number().positive().required(),
      currencyTypeIso: Joi.string().length(3).uppercase().required(), // Limit to AUD?
      imageFileId: Joi.alternatives()
        .try(Joi.array().items(Joi.string().uuid()), Joi.string().uuid())
        .required(),
      categoryRefId: Joi.string().uuid().required(),
      size: Joi.string().max(64),
      brandName: Joi.string().max(128),
      condition: Joi.string().valid(
        'new',
        'used_like_new',
        'used_good',
        'used_fair'
      ),
    }),
  },

  getListingSchema: {
    PARAMS: Joi.object({
      listingId: Joi.string().uuid().required(),
    }),
  },

  getListingsSchema: {
    QUERY: Joi.object({
      orderBy: Joi.array().items(
        Joi.valid(
          'priceValue',
          '-priceValue',
          'createdAt',
          '-createdAt',
          'updatedAt',
          '-updatedAt'
        )
      ),
      filterBy: Joi.array().items(
        Joi.valid('isRentable', 'isPurchasable', 'isAvailable', '-isAvailable')
      ),
      titleiLike: Joi.string(),
      priceGte: Joi.number(),
      priceLte: Joi.number(),
      currencyTypeIso: Joi.string().length(3).uppercase(), // Limit to AUD?
      userId: Joi.array().items(Joi.string().uuid()),
      categoryRefId: Joi.array().items(Joi.string().uuid()),
      orderByLatLng: Joi.string().regex(ORDER_BY_LAT_LNG_QUERY),
      limit: Joi.number().positive().allow(0),
      offset: Joi.number().positive().allow(0),
    }),
  },

  updateListingSchema: {
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

  deleteListingSchema: {
    PARAMS: Joi.object({
      listingId: Joi.string().uuid().required(),
    }),
  },

  createEnquirySchema: {
    PARAMS: Joi.object({
      listingId: Joi.string().uuid().required(),
    }),

    BODY: Joi.object({
      note: Joi.string().max(256),
    }),
  },

  getEnquiriesSchema: {
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

  createPurchaseSchema: {
    PARAMS: Joi.object({
      listingId: Joi.string().uuid().required(),
    }),
  },

  getPurchasesSchema: {
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
        Joi.array().items(Joi.valid('IsPending', 'isCancelled', 'isPicked')),
        Joi.valid('IsPending', 'isCancelled', 'isPicked')
      ),
      limit: Joi.number().positive().allow(0),
      offset: Joi.number().positive().allow(0),
    }),
  },

  getImagesSchema: {
    PARAMS: Joi.object({
      listingId: Joi.string().uuid().required(),
    }),
  },

  getImageSchema: {
    PARAMS: Joi.object({
      listingId: Joi.string().uuid().required(),
      listingImageId: Joi.string().uuid().required(),
    }),
  },

  createImageSchema: {
    PARAMS: Joi.object({
      listingId: Joi.string().uuid().required(),
    }),
    BODY: Joi.object({
      fileId: Joi.string().uuid().required(),
      orderIndex: Joi.number().positive(),
    }),
  },

  updateImageSchema: {
    PARAMS: Joi.object({
      listingId: Joi.string().uuid().required(),
      listingImageId: Joi.string().uuid().required(),
    }),
    BODY: Joi.object({
      orderIndex: Joi.number().positive(),
    }),
  },

  deleteImageSchema: {
    PARAMS: Joi.object({
      listingId: Joi.string().uuid().required(),
      listingImageId: Joi.string().uuid().required(),
    }),
  },
};
