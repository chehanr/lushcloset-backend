const express = require('express');

const authMiddleware = require('../../middlewares/auth');
const validationMiddleware = require('../../middlewares/validation');
const refController = require('../../controllers/ref');
const refValidator = require('../../validators/ref');

const router = express.Router();

// /categories                   get

router.get(
  '/categories',
  authMiddleware.authOptional,
  validationMiddleware(refValidator.getCategoryRefsSchema),
  (req, res) => {
    refController.getCategoryRefs(req, res);
  }
);

module.exports = router;
