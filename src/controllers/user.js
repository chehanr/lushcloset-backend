const models = require('../models');
const BaseController = require('./base');
const { errorResponses } = require('../constants/errors');
const fileUtils = require('../utils/file');

class UserController extends BaseController {
  /**
   * Get a user \
   * with params `userId`.
   */
  async getUser(req, res) {
    let errorResponseData;

    if (req.validated.params?.error) {
      errorResponseData = errorResponses.validationParamError;
      errorResponseData.extra = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseData);
    }

    const { userId } = req.validated.params.value;

    let userObj;

    try {
      userObj = await models.User.findByPk(userId, {
        include: [
          {
            model: models.UserVerification,
            as: 'userVerification',
          },
          {
            model: models.UserAvatar,
            as: 'userAvatar',
            include: [
              {
                model: models.File,
                as: 'file',
                include: [
                  {
                    model: models.FileLink,
                    as: 'fileLinks',
                  },
                ],
              },
            ],
          },
        ],
      });
    } catch (error) {
      return this.fail(res, error);
    }

    if (!userObj) {
      return this.notFound(res);
    }

    const responseData = {
      id: userObj.id,
      name: userObj.name,
      avatar: null,
      emailVerifiedAt: userObj.userVerification?.emailVerifiedAt || null,
      createdAt: userObj.createdAt,
    };

    if (userObj.userAvatar) {
      const userAvatarObj = userObj.userAvatar;

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
}

module.exports = new UserController();
