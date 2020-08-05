const express = require('express');

const authMiddleware = require('../../middlewares/auth');
const validationMiddleware = require('../../middlewares/validation');
const enquiryController = require('../../controllers/enquiry');
const enquiryValidator = require('../../validators/enquiry');

const router = express.Router();

// /:enquiryId                get, put, delete
// /:enquiryId/accept         post
// /:enquiryId/reject         post
// /:enquiryId/cancel         post

router.get(
  '/:enquiryId',
  authMiddleware.authRequired,
  validationMiddleware(enquiryValidator.retrieveListingEnquiryItemSchema),
  (req, res) => {
    enquiryController.retrieveListingEnquiryItem(req, res);
  }
);

router.put(
  '/:enquiryId',
  authMiddleware.authRequired,
  validationMiddleware(enquiryValidator.updateListingEnquiryItemSchema),
  (req, res) => {
    enquiryController.updateListingEnquiryItem(req, res);
  }
);

router.delete(
  '/:enquiryId',
  authMiddleware.authRequired,
  validationMiddleware(enquiryValidator.deleteListingEnquirySchema),
  (req, res) => {
    enquiryController.deleteListingEnquiryItem(req, res);
  }
);

router.post(
  '/:enquiryId/accept',
  authMiddleware.authRequired,
  validationMiddleware(enquiryValidator.acceptListingEnquiryItemSchema),
  (req, res) => {
    enquiryController.acceptListingEnquiryItem(req, res);
  }
);

router.post(
  '/:enquiryId/reject',
  authMiddleware.authRequired,
  validationMiddleware(enquiryValidator.rejectListingEnquiryItemSchema),
  (req, res) => {
    enquiryController.rejectListingEnquiryItem(req, res);
  }
);

router.post(
  '/:enquiryId/cancel',
  authMiddleware.authRequired,
  validationMiddleware(enquiryValidator.cancelListingEnquiryItemSchema),
  (req, res) => {
    enquiryController.cancelListingEnquiryItem(req, res);
  }
);

module.exports = router;
