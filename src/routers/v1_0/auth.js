const express = require('express');

const authController = require('../../controllers/auth');
const userController = require('../../controllers/user');
const authMiddleware = require('../../middlewares/auth');
const validationMiddleware = require('../../middlewares/validation');
const authValidator = require('../../validators/auth');

const router = express.Router();

// /local/login       post
// /local/register    post
// /me                get

router.post(
  '/local/login',
  validationMiddleware(authValidator.retrieveLocalUserItemSchema),
  (req, res) => {
    authController.retrieveLocalUserItem(req, res);
  }
);

router.post(
  '/local/register',
  validationMiddleware(authValidator.createLocalUserItemSchema),
  (req, res) => {
    authController.createLocalUserItem(req, res);
  }
);

router.get('/me', authMiddleware.authRequired, (req, res) => {
  userController.retrieveAuthenticatedUserItem(req, res);
});

module.exports = router;
