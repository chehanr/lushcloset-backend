const express = require('express');

const authController = require('../../controllers/auth');
const userController = require('../../controllers/user');
const authMiddleware = require('../../middlewares/auth');
const validationMiddleware = require('../../middlewares/validation');
const authValidator = require('../../validators/auth');

const router = express.Router();

// /local/login               post
// /local/register            post
// /me                        get
// /verify/email              get
// /verify/email/resend       post

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

router.get(
  '/verify/email',
  validationMiddleware(authValidator.verifyEmailSchema),
  async (req, res) => {
    await authController.verifyEmail(req, res);
  }
);

router.post(
  '/verify/email/resend',
  authMiddleware.authRequired,
  validationMiddleware(authValidator.resendVerifyEmailSchema),
  async (req, res) => {
    await authController.resendVerifyEmail(req, res);
  }
);

module.exports = router;
