const express = require('express');

const authMiddleware = require('../../middlewares/auth');
const validationMiddleware = require('../../middlewares/validation');
const rentalController = require('../../controllers/rental');
const rentalValidator = require('../../validators/rental');

const router = express.Router();

// /:rentalId                       get
// /:rentalId/verify/pickup         post
// /:rentalId/verify/return         post

router.get(
  '/:rentalId',
  authMiddleware.authRequired,
  validationMiddleware(rentalValidator.retrieveListingRentalItemSchema),
  (req, res) => {
    rentalController.retrieveListingRentalItem(req, res);
  }
);

module.exports = router;
