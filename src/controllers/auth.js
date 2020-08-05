const BaseController = require('./base');
const authUtils = require('../utils/auth');
const models = require('../models');

class AuthController extends BaseController {
  /**
   * Create a local user (register).
   */
  async createLocalUserItem(req, res) {
    const errorResponseObj = { validation: {} };

    if (req.validated.body?.error) {
      errorResponseObj.validation.body = req.validated.body.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
      const foundUserObj = await models.User.findOne({
        where: {
          email: req.validated.body.value.email,
        },
      });

      if (foundUserObj) {
        return this.conflict(res, 'User already exists');
      }

      const newUserObj = await models.sequelize.transaction(async (t) => {
        const userObj = await models.User.create(
          {
            name: req.validated.body.value.name,
            email: req.validated.body.value.email,
          },
          {
            transaction: t,
          }
        );

        await models.AuthLocal.create(
          {
            userId: userObj.id,
            password: req.validated.body.value.password,
          },
          {
            transaction: t,
          }
        );

        return userObj;
      });

      if (newUserObj) {
        const tokenUserObj = {
          user: {
            id: newUserObj.id,
            email: newUserObj.email,
          },
        };

        const token = authUtils.generateJwt(tokenUserObj);

        if (token) {
          const responseObj = {
            access_token: token,
          };

          return this.ok(res, responseObj);
        }

        return this.fail(res, 'Error creating token');
      }

      return this.fail(res, 'Error creating new local user');
    } catch (error) {
      return this.fail(res, error);
    }
  }

  /**
   * Retrieve (POST) a local user (login).
   */
  async retrieveLocalUserItem(req, res) {
    const errorResponseObj = { validation: {} };

    if (req.validated.body?.error) {
      errorResponseObj.validation.body = req.validated.body.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
      const foundUserObj = await models.User.findOne({
        where: {
          email: req.validated.body.value.email,
        },
      });

      let authLocalObj;

      if (foundUserObj) {
        authLocalObj = await foundUserObj.getAuthLocal();
      }

      if (
        foundUserObj &&
        authLocalObj &&
        (await authLocalObj.isPasswordValid(
          req.validated.body.value.password
        )) === true
      ) {
        const tokenUserObj = {
          user: {
            id: foundUserObj.id,
            email: foundUserObj.email,
          },
        };

        const token = authUtils.generateJwt(tokenUserObj);

        if (token) {
          const responseObj = {
            access_token: token,
          };

          return this.ok(res, responseObj);
        }

        return this.fail(res, 'Error creating token');
      }

      return this.unauthorized(res, null);
    } catch (error) {
      return this.fail(res, error);
    }
  }

  /**
   * Retrieve a JWT object for a local user.
   */
  retrieveJwtItem(req, res) {
    try {
      const tokenUserObj = {
        user: {
          id: req.user.id,
          email: req.user.email,
        },
      };

      const token = authUtils.generateJwt(tokenUserObj);

      if (token) {
        const responseObj = {
          access_token: token,
        };

        return this.ok(res, responseObj);
      }

      return this.fail(res, 'Error creating token');
    } catch (error) {
      return this.fail(res, error);
    }
  }

  notAuthenticated(req, res) {
    return this.unauthorized(res, 'Not authenticated');
  }
}

module.exports = new AuthController();
