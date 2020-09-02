const models = require('../models');
const BaseController = require('./base');
const { errorResponses } = require('../constants/errors');

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
      userObj = await models.User.findByPk(userId);
    } catch (error) {
      return this.fail(res, error);
    }

    if (!userObj) {
      return this.notFound(res);
    }

    const responseData = {
      id: userObj.id,
      name: userObj.name,
      avatar: {},
      createdAt: userObj.createdAt,
    };

    return this.ok(res, responseData);
  }
}

module.exports = new UserController();
