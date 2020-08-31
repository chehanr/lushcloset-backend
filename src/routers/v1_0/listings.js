const express = require('express');

const authMiddleware = require('../../middlewares/auth');
const validationMiddleware = require('../../middlewares/validation');
const listingController = require('../../controllers/listing');
const listingValidator = require('../../validators/listing');

const router = express.Router();

// /                                    get, post
// /:listingId                          get, put, delete
// /:listingId/enquiries                get, post
// /:listingId/images/                  get
// /:listingId/images/:listingImageId   get, put, delete

router.get(
  '/',
  authMiddleware.authOptional,
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

router.get(
  '/:listingId/purchases',
  authMiddleware.authRequired,
  validationMiddleware(
    listingValidator.retrieveListingItemListingPurchaseListSchema
  ),
  (req, res) => {
    listingController.retrieveListingItemListingPurchaseList(req, res);
  }
);

router.post(
  '/:listingId/purchases',
  authMiddleware.authRequired,
  validationMiddleware(
    listingValidator.createListingItemListingPurchaseItemSchema
  ),
  (req, res) => {
    listingController.createListingItemListingPurchaseItem(req, res);
  }
);

router.get(
  '/:listingId/images',
  authMiddleware.authOptional,
  validationMiddleware(listingValidator.getImagesSchema),
  async (req, res) => {
    await listingController.getImages(req, res);
  }
);

router.get(
  '/:listingId/images/:listingImageId',
  authMiddleware.authOptional,
  validationMiddleware(listingValidator.getImageSchema),
  async (req, res) => {
    await listingController.getImage(req, res);
  }
);

router.post(
  '/:listingId/images',
  authMiddleware.authRequired,
  validationMiddleware(listingValidator.createImageSchema),
  async (req, res) => {
    await listingController.createImage(req, res);
  }
);

router.put(
  '/:listingId/images/:listingImageId',
  authMiddleware.authRequired,
  validationMiddleware(listingValidator.updateImageSchema),
  async (req, res) => {
    await listingController.updateImage(req, res);
  }
);

router.delete(
  '/:listingId/images/:listingImageId',
  authMiddleware.authRequired,
  validationMiddleware(listingValidator.deleteImageSchema),
  async (req, res) => {
    await listingController.deleteImage(req, res);
  }
);

module.exports = router;
