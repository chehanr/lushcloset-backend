const express = require('express');

const authMiddleware = require('../../middlewares/auth');
const validationMiddleware = require('../../middlewares/validation');
const listingController = require('../../controllers/listing');
const listingValidator = require('../../validators/listing');

const router = express.Router();

// /                          get, post
// /:listingId                get, put, delete
// /:listingId/enquiries      get, post

router.get(
  '/',
  authMiddleware.authRequired,
  validationMiddleware(listingValidator.retrieveListingListSchema),
  (req, res) => {
    listingController.retrieveListingList(req, res);
  }
);

router.post(
  '/',
  authMiddleware.authRequired,
  validationMiddleware(listingValidator.createListingItemSchema),
  (req, res) => {
    listingController.createListingItem(req, res);
  }
);

router.get(
  '/:listingId',
  authMiddleware.authOptional,
  validationMiddleware(listingValidator.retrieveListingItemSchema),
  (req, res) => {
    listingController.retrieveListingItem(req, res);
  }
);

router.put(
  '/:listingId',
  authMiddleware.authRequired,
  validationMiddleware(listingValidator.updateListingItemSchema),
  (req, res) => {
    listingController.updateListingItem(req, res);
  }
);

router.delete(
  '/:listingId',
  authMiddleware.authRequired,
  validationMiddleware(listingValidator.deleteListingItemSchema),
  (req, res) => {
    listingController.deleteListingItem(req, res);
  }
);

router.get(
  '/:listingId/enquiries',
  authMiddleware.authRequired,
  validationMiddleware(
    listingValidator.retrieveListingItemListingEnquiryListSchema
  ),
  (req, res) => {
    listingController.retrieveListingItemListingEnquiryList(req, res);
  }
);

router.post(
  '/:listingId/enquiries',
  authMiddleware.authRequired,
  validationMiddleware(
    listingValidator.createListingItemListingEnquiryItemSchema
  ),
  (req, res) => {
    listingController.createListingItemListingEnquiryItem(req, res);
  }
);

module.exports = router;
