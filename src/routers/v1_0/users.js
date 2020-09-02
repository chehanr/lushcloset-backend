const express = require('express');

const authMiddleware = require('../../middlewares/auth');
const validationMiddleware = require('../../middlewares/validation');
const userController = require('../../controllers/user');
const userValidator = require('../../validators/user');

const router = express.Router();

// /:userId                   get

router.get(
  '/:userId',
  authMiddleware.authRequired,
  validationMiddleware(userValidator.getUserSchema),
  async (req, res) => {
    await userController.getUser(req, res);
  }
);

module.exports = router;
