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
  validationMiddleware(listingValidator.getListingsSchema),
  async (req, res) => {
    await listingController.getListings(req, res);
  }
);

router.post(
  '/',
  authMiddleware.authRequired,
  validationMiddleware(listingValidator.createListingSchema),
  async (req, res) => {
    await listingController.createListing(req, res);
  }
);

router.get(
  '/:listingId',
  authMiddleware.authOptional,
  validationMiddleware(listingValidator.getListingSchema),
  async (req, res) => {
    await listingController.getListing(req, res);
  }
);

router.put(
  '/:listingId',
  authMiddleware.authRequired,
  validationMiddleware(listingValidator.updateListingSchema),
  async (req, res) => {
    await listingController.updateListing(req, res);
  }
);

router.delete(
  '/:listingId',
  authMiddleware.authRequired,
  validationMiddleware(listingValidator.deleteListingSchema),
  async (req, res) => {
    await listingController.deleteListing(req, res);
  }
);

router.get(
  '/:listingId/enquiries',
  authMiddleware.authRequired,
  validationMiddleware(listingValidator.getEnquiriesSchema),
  async (req, res) => {
    await listingController.getEnquiries(req, res);
  }
);

router.post(
  '/:listingId/enquiries',
  authMiddleware.authRequired,
  validationMiddleware(listingValidator.createEnquirySchema),
  async (req, res) => {
    await listingController.createEnquiry(req, res);
  }
);

router.get(
  '/:listingId/purchases',
  authMiddleware.authRequired,
  validationMiddleware(listingValidator.getPurchasesSchema),
  async (req, res) => {
    await listingController.getPurchases(req, res);
  }
);

router.post(
  '/:listingId/purchases',
  authMiddleware.authRequired,
  validationMiddleware(listingValidator.createPurchaseSchema),
  async (req, res) => {
    await listingController.createPurchase(req, res);
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
