const models = require('../models');
const BaseController = require('./base');
const { errorResponses } = require('../constants/errors');

class UserController extends BaseController {
  /**
   * Retrieve a user \
   * with params `userId`.
   */
  async retrieveUserItem(req, res) {
    let errorResponseObj;

    if (req.validated.params?.error) {
      errorResponseObj = errorResponses.validationParamError;
      errorResponseObj.extra = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
      const userObj = await models.User.findByPk(
        req.validated.params.value.userId
      );

      if (userObj) {
        const responseObj = {
          id: userObj.id,
          name: userObj.name,
          photoUri: userObj.photoUri,
        };

        return this.ok(res, responseObj);
      }

      return this.notFound(res, null);
    } catch (error) {
      return this.fail(res, error);
    }
  }

  /**
   * Update a user \
   * with params `userId`.
   */
  async updateUserItem(req, res) {
    let errorResponseObj;

    if (req.validated.params?.error) {
      errorResponseObj = errorResponses.validationParamError;
      errorResponseObj.extra = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    if (req.validated.body?.error) {
      errorResponseObj = errorResponses.validationBodyError;
      errorResponseObj.extra = req.validated.body.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
      let userObj = await models.User.findByPk(
        req.validated.params.value.userId
      );

      if (userObj) {
        if (userObj.id !== req.user?.id) {
          return this.unauthorized(res, null);
        }

        // Update `name`.
        const userUpdateData = {};

        if (
          typeof req.validated.body.value.name !== 'undefined' &&
          req.validated.body.value.name !== userObj.name
        ) {
          userUpdateData.name = req.validated.body.value.name;
        }

        if (Object.keys(userUpdateData).length) {
          // Only updated if needed.
          userObj = await models.sequelize.transaction(async (t) => {
            return userObj.update(userUpdateData, {
              returning: true,
              plain: true,
              transaction: t,
            });
          });
        }

        const responseObj = {
          id: userObj.id,
          name: userObj.name,
          photoUri: userObj.photoUri,
        };

        return this.ok(res, responseObj);
      }

      return this.notFound(res, null);
    } catch (error) {
      return this.fail(res, error);
    }
  }

  /**
   * Retrieve the authenticated user.
   */
  async retrieveAuthenticatedUserItem(req, res) {
    if (req.user) {
      const responseObj = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        photoUri: req.user.photoUri,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt,
      };

      return this.ok(res, responseObj);
    }

    // 404 or 500?
    return this.notFound(res, null);
  }
}

module.exports = new UserController();
