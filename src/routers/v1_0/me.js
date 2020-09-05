const express = require('express');

const authMiddleware = require('../../middlewares/auth');
const validationMiddleware = require('../../middlewares/validation');
const meController = require('../../controllers/me');
const meValidator = require('../../validators/me');

const router = express.Router();

// /                          get, put
// /avatar                    post

router.get(
  '/',
  authMiddleware.authRequired,
  validationMiddleware(meValidator.getMeSchema),
  async (req, res) => {
    await meController.getMe(req, res);
  }
);

router.put(
  '/',
  authMiddleware.authRequired,
  validationMiddleware(meValidator.updateMeSchema),
  async (req, res) => {
    await meController.updateMe(req, res);
  }
);

router.post(
  '/avatar',
  authMiddleware.authRequired,
  validationMiddleware(meValidator.createAvatarSchema),
  async (req, res) => {
    await meController.createAvatar(req, res);
  }
);

module.exports = router;
