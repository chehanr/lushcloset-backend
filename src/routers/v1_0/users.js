const express = require('express');

const authMiddleware = require('../../middlewares/auth');
const validationMiddleware = require('../../middlewares/validation');
const userController = require('../../controllers/user');
const userValidator = require('../../validators/user');

const router = express.Router();

// /:userId                   get, put, delete
// /:userId/notes             get

router.get(
  '/:userId',
  authMiddleware.authRequired,
  validationMiddleware(userValidator.retrieveUserItemSchema),
  (req, res) => {
    userController.retrieveUserItem(req, res);
  }
);

router.put(
  '/:userId',
  authMiddleware.authRequired,
  validationMiddleware(userValidator.updateUserItemSchema),
  (req, res) => {
    userController.updateUserItem(req, res);
  }
);

router.delete('/:userId', authMiddleware.authRequired, (req, res) => {
  userController.imATeapot(req, res);
});

module.exports = router;
