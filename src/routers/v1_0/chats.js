const express = require('express');

const authMiddleware = require('../../middlewares/auth');
const validationMiddleware = require('../../middlewares/validation');
const chatController = require('../../controllers/chat');
const chatValidator = require('../../validators/chat');

const router = express.Router();

// /                          get, post
// /:chatTheadId              get
// /:chatTheadId/messages     get, post

router.get(
  '/',
  authMiddleware.authRequired,
  validationMiddleware(chatValidator.retrieveChatThreadListSchema),
  (req, res) => {
    chatController.retrieveChatThreadList(req, res);
  }
);

router.post(
  '/',
  authMiddleware.authRequired,
  validationMiddleware(chatValidator.createChatThreadItemSchema),
  (req, res) => {
    chatController.createChatThreadItem(req, res);
  }
);

router.get(
  '/:chatTheadId',
  authMiddleware.authRequired,
  validationMiddleware(chatValidator.retrieveChatThreadItemSchema),
  (req, res) => {
    chatController.retrieveChatThreadItem(req, res);
  }
);

router.post(
  '/:chatTheadId/messages',
  authMiddleware.authRequired,
  validationMiddleware(chatValidator.createChatMessageItemSchema),
  (req, res) => {
    chatController.createChatMessageItem(req, res);
  }
);

router.get(
  '/:chatTheadId/messages',
  authMiddleware.authRequired,
  validationMiddleware(chatValidator.retrieveChatMessageListSchema),
  (req, res) => {
    chatController.retrieveChatMessageList(req, res);
  }
);

module.exports = router;
