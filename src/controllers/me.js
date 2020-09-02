const models = require('../models');
const BaseController = require('./base');
const { errorResponses } = require('../constants/errors');

class MeController extends BaseController {
  /**
   * Get the current user.
   */
  async getMe(req, res) {
    if (!req.user) {
      // 404 or 500?
      return this.notFound(res);
    }

    const responseData = {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      avatar: {},
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    };

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

    let userObj;

    try {
      userObj = await models.User.findByPk(req.user.id);
    } catch (error) {
      return this.fail(res);
    }

    if (userObj.id !== req.user.id) {
      return this.unauthorized(res);
    }

    try {
      await userObj.update({ name }, { returning: true, plain: true });
    } catch (error) {
      return this.fail(res);
    }

    const responseData = {
      id: userObj.id,
      name: userObj.name,
      email: userObj.email,
      avatar: {},
      createdAt: userObj.createdAt,
      updatedAt: userObj.updatedAt,
    };

    return this.ok(res, responseData);
  }
}

module.exports = new MeController();
