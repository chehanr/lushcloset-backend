const models = require('../models');
const BaseController = require('./base');
const { errorResponses } = require('../constants/errors');
const fileUtils = require('../utils/file');

class MeController extends BaseController {
  /**
   * Get the current user.
   */
  async getMe(req, res) {
    try {
      req.user.userVerification = await req.user.getUserVerification();

      req.user.userAvatar = await req.user.getUserAvatar({
        include: [
          {
            model: models.File,
            as: 'file',
            include: [{ model: models.FileLink, as: 'fileLinks' }],
          },
        ],
      });
    } catch (error) {
      return this.fail(res, error);
    }

    const responseData = {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      avatar: null,
      emailVerifiedAt: req.user.userVerification?.emailVerifiedAt || null,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    };

    if (req.user.userAvatar) {
      const userAvatarObj = req.user.userAvatar;

      responseData.avatar = {};

      responseData.avatar.id = userAvatarObj.id;
      responseData.avatar.file = {
        id: userAvatarObj.file.id,
        links: [],
      };

      userAvatarObj.file.fileLinks.forEach((fileLinkObj) => {
        responseData.avatar.file.links.push({
          id: fileLinkObj.id,
          fileSize: fileLinkObj.fileSize,
          fileContentType: fileLinkObj.fileContentType,
          url: fileUtils.getFileLinkUrl(fileLinkObj),
          metadata: fileLinkObj.metadata || {},
        });
      });
    }

    return this.ok(res, responseData);
  }

  /**
   * Update the current user.
   */
  async updateMe(req, res) {
    let errorResponseData;

    if (req.validated.body?.error) {
      errorResponseData = errorResponses.validationBodyError;
      errorResponseData.extra = req.validated.body.error;

      return this.unprocessableEntity(res, errorResponseData);
    }

    const { name } = req.validated.body.value;

    try {
      req.user.userVerification = await req.user.getUserVerification();

      req.user.userAvatar = await req.user.getUserAvatar({
        limit: 1,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: models.File,
            as: 'file',
            include: [{ model: models.FileLink, as: 'fileLinks' }],
          },
        ],
      });
    } catch (error) {
      return this.fail(res);
    }

    try {
      await req.user.update({ name }, { returning: true, plain: true });
    } catch (error) {
      return this.fail(res);
    }

    const responseData = {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      avatar: null,
      emailVerifiedAt: req.user.userVerification?.emailVerifiedAt || null,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    };

    if (req.user.userAvatar) {
      const userAvatarObj = req.user.userAvatar;

      responseData.avatar = {};

      responseData.avatar.id = userAvatarObj.id;
      responseData.avatar.file = {
        id: userAvatarObj.file.id,
        links: [],
      };

      userAvatarObj.file.fileLinks.forEach((fileLinkObj) => {
        responseData.avatar.file.links.push({
          id: fileLinkObj.id,
          fileSize: fileLinkObj.fileSize,
          fileContentType: fileLinkObj.fileContentType,
          url: fileUtils.getFileLinkUrl(fileLinkObj),
          metadata: fileLinkObj.metadata || {},
        });
      });
    }

    return this.ok(res, responseData);
  }

  /**
   * Create an avatar (file) for a user.
   */
  async createAvatar(req, res) {
    let errorResponseData;

    if (req.validated.body?.error) {
      errorResponseData = errorResponses.validationBodyError;
      errorResponseData.extra = req.validated.body.error;

      return this.unprocessableEntity(res, errorResponseData);
    }

    const { fileId } = req.validated.body.value;

    let userObj;
    let fileObj;

    try {
      userObj = await models.User.findByPk(req.user.id, {
        include: [{ model: models.UserAvatar, as: 'userAvatar' }],
      });

      fileObj = await models.File.findByPk(fileId);
    } catch (error) {
      return this.fail(res, error);
    }

    if (!fileObj) {
      errorResponseData = errorResponses.fileNotFoundError;
      return this.notFound(res, errorResponseData);
    }

    if (fileObj.userId !== userObj.id) {
      return this.unauthorized(res);
    }

    if (fileObj.purpose !== 'user_avatar') {
      errorResponseData = errorResponses.invalidFilePurposeError;
      return this.badRequest(res, errorResponseData);
    }

    let userAvatarObj;

    try {
      await models.sequelize.transaction(async (transaction) => {
        if (userObj.userAvatar) {
          // Delete previous avatar.
          await userObj.userAvatar.destroy({ transaction });
        }

        userAvatarObj = await models.UserAvatar.create(
          { userId: userObj.id, fileId },
          { transaction }
        );

        userAvatarObj.file = await userAvatarObj.getFile({
          include: [{ model: models.FileLink, as: 'fileLinks' }],
          transaction,
        });
      });
    } catch (error) {
      return this.fail(res, error);
    }

    const responseData = {
      id: userAvatarObj.id,
      file: {
        id: userAvatarObj.file.id,
        purpose: userAvatarObj.file.purpose,
        links: [],
      },
      createdAt: userAvatarObj.createdAt,
      updatedAt: userAvatarObj.updatedAt,
    };

    userAvatarObj.file.fileLinks.forEach((fileLinkObj) => {
      responseData.file.links.push({
        id: fileLinkObj.id,
        fileName: fileLinkObj.fileName,
        fileSize: fileLinkObj.fileSize,
        fileContentType: fileLinkObj.fileContentType,
        url: fileUtils.getFileLinkUrl(fileLinkObj),
        metadata: fileLinkObj.metadata || {},
        uploadedAt: fileLinkObj.uploadedAt,
        expiresAt: fileLinkObj.expiresAt,
        createdAt: fileLinkObj.createdAt,
        updatedAt: fileLinkObj.updatedAt,
      });
    });

    return this.created(res, responseData);
  }
}

module.exports = new MeController();
