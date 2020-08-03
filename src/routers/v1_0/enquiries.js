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

module.exports = router;