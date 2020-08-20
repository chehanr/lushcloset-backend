const express = require('express');

const authMiddleware = require('../../middlewares/auth');
const validationMiddleware = require('../../middlewares/validation');
const purchaseController = require('../../controllers/purchase');
const purchaseValidator = require('../../validators/purchase');

const router = express.Router();

// /:purchaseId                       get
// /:purchaseId/verify/pickup         post
// /:purchaseId/cancel                post

router.get(
  '/:purchaseId',
  authMiddleware.authRequired,
  validationMiddleware(purchaseValidator.retrieveListingPurchaseItemSchema),
  (req, res) => {
    purchaseController.retrieveListingPurchaseItem(req, res);
  }
);

router.post(
  '/:purchaseId/verify/pickup',
  authMiddleware.authRequired,
  validationMiddleware(purchaseValidator.verifyPickupListingPurchaseItemSchema),
  (req, res) => {
    purchaseController.verifyPickupListingPurchaseItem(req, res);
  }
);

router.post(
  '/:purchaseId/cancel',
  authMiddleware.authRequired,
  validationMiddleware(purchaseValidator.cancelListingPurchaseItemSchema),
  (req, res) => {
    purchaseController.cancelListingPurchaseItem(req, res);
  }
);

module.exports = router;
