const express = require('express');

const authMiddleware = require('../../middlewares/auth');
const validationMiddleware = require('../../middlewares/validation');
const fileController = require('../../controllers/file');
const fileValidator = require('../../validators/file');

const router = express.Router();

// /                          get, post
// /:fileId                   get

router.get(
  '/',
  authMiddleware.authRequired,
  validationMiddleware(fileValidator.getFilesSchema),
  (req, res) => {
    fileController.getFiles(req, res);
  }
);

router.post(
  '/',
  authMiddleware.authRequired,
  validationMiddleware(fileValidator.createFileSchema),
  (req, res) => {
    fileController.createFile(req, res);
  }
);

router.get(
  '/:fileId',
  authMiddleware.authOptional,
  validationMiddleware(fileValidator.getFileSchema),
  (req, res) => {
    fileController.getFile(req, res);
  }
);

module.exports = router;
