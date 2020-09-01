const BaseController = require('../controllers/base');
const models = require('../models');
const { errorResponses } = require('../constants/errors');

const baseController = new BaseController();

module.exports = {
  async email(req, res, next) {
    try {
      const userVerifObj = await models.UserVerification.findOne({
        where: { userId: req.user.id },
      });

      if (!userVerifObj.emailVerifiedAt) {
        const errorResponseData = errorResponses.userNotVerifiedError;
        errorResponseData.extra = {
          fields: ['email'],
        };

        return baseController.unauthorized(res, errorResponseData);
      }
    } catch (error) {
      return baseController.fail(res, error);
    }

    return next();
  },

  // emailAndPhone(req, res, next) {
  //   return next();
  // },
};
