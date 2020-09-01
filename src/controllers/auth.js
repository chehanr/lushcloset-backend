const BaseController = require('./base');
const authUtils = require('../utils/auth');
const mailUtils = require('../utils/mail');
const serverConfig = require('../configs/server');
const models = require('../models');
const { errorResponses } = require('../constants/errors');

class AuthController extends BaseController {
  /**
   * Create a local user (register).
   */
  async createLocalUserItem(req, res) {
    let errorResponseData;

    if (req.validated.body?.error) {
      errorResponseData = errorResponses.validationBodyError;
      errorResponseData.extra = req.validated.body.error;

      return this.unprocessableEntity(res, errorResponseData);
    }

    const { email, name, password } = req.validated.body.value;

    let userObj;

    try {
      userObj = await models.User.findOne({ where: { email } });
    } catch (error) {
      return this.fail(res, error);
    }

    if (userObj) {
      return this.conflict(res, errorResponses.userAlreadyExistsError);
    }

    try {
      await models.sequelize.transaction(async (transaction) => {
        userObj = await models.User.create(
          {
            name,
            email,
            authLocal: {
              password,
            },
            userVerification: {},
          },
          {
            include: [
              { model: models.AuthLocal, as: 'authLocal' },
              { model: models.UserVerification, as: 'userVerification' },
            ],
            transaction,
          }
        );

        if (serverConfig.autoUserEmailVerify) {
          // Users are verified automatically.
          await userObj.userVerification.update(
            { emailVerifiedAt: models.sequelize.literal('CURRENT_TIMESTAMP') },
            { transaction }
          );
        } else {
          // Send a verification email.
          mailUtils.sendEmailVerification(
            userObj,
            userObj.userVerification.emailVerifySecret
          );
        }
      });
    } catch (error) {
      return this.fail(res, error);
    }

    let accessToken;

    if (userObj) {
      const tokenUserObj = {
        user: {
          id: userObj.id,
          email: userObj.email,
        },
      };

      accessToken = authUtils.generateJwt(tokenUserObj);
    }

    const responseData = {
      accessToken,
    };

    return this.created(res, responseData);
  }

  /**
   * Retrieve (POST) a local user (login).
   */
  async retrieveLocalUserItem(req, res) {
    let errorResponseObj;

    if (req.validated.body?.error) {
      errorResponseObj = errorResponses.validationBodyError;
      errorResponseObj.extra = req.validated.body.error;

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
            accessToken: token,
          };

          return this.ok(res, responseObj);
        }

        return this.fail(res, 'Error creating token');
      }

      return this.notFound(res, errorResponses.userNotFoundError);
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
          accessToken: token,
        };

        return this.ok(res, responseObj);
      }

      return this.fail(res, 'Error creating token');
    } catch (error) {
      return this.fail(res, error);
    }
  }

  notAuthenticated(req, res) {
    return this.unauthorized(res, errorResponses.userNotAuthenticatedError);
  }

  /**
   * Verify a user's email.
   */
  async verifyEmail(req, res) {
    let errorResponseData;

    if (req.validated.query?.error) {
      errorResponseData = errorResponses.validationQueryError;
      errorResponseData.extra = req.validated.query.error;

      return this.unprocessableEntity(res, errorResponseData);
    }

    const { userId, token } = req.validated.query.value;

    let userVerifObj;

    try {
      userVerifObj = await models.UserVerification.findOne({
        where: { userId },
        include: [{ model: models.User, as: 'user' }],
      });
    } catch (error) {
      return this.fail(res, error);
    }

    if (!userVerifObj) {
      return this.notFound(res);
    }

    if (userVerifObj.emailVerifiedAt) {
      errorResponseData = errorResponses.userAlreadyVerifiedError;
      errorResponseData.extra = {
        fields: ['email'],
      };

      return this.badRequest(res, errorResponseData);
    }

    let verifyData;

    let isVerified = false;

    try {
      await models.sequelize.transaction(async (transaction) => {
        verifyData = mailUtils.decodeEmailToken(
          token,
          userVerifObj.emailVerifySecret
        );

        if (verifyData.id === userVerifObj.userId) {
          await userVerifObj
            .update(
              {
                emailVerifiedAt: models.sequelize.literal('CURRENT_TIMESTAMP'),
              },
              { transaction }
            )
            .then(() => {
              isVerified = true;
            });
        }
      });
    } catch (error) {
      return this.fail(res, error);
    }

    if (isVerified) {
      return this.ok(res);
    }

    return this.unauthorized(res);
  }

  /**
   * Resend a verificiation email.
   */
  async resendVerifyEmail(req, res) {
    let errorResponseData;

    let userVerifObj;

    try {
      userVerifObj = await models.UserVerification.findOne({
        where: { userId: req.user.id },
        include: [{ model: models.User, as: 'user' }],
      });
    } catch (error) {
      return this.fail(res, error);
    }

    if (!userVerifObj) {
      return this.notFound(res);
    }

    if (userVerifObj.emailVerifiedAt) {
      errorResponseData = errorResponses.userAlreadyVerifiedError;
      errorResponseData.extra = {
        fields: ['email'],
      };

      return this.badRequest(res, errorResponseData);
    }

    try {
      mailUtils.sendEmailVerification(
        userVerifObj.user,
        userVerifObj.emailVerifySecret
      );
    } catch (error) {
      return this.fail(res, error);
    }

    return this.ok(res);
  }
}

module.exports = new AuthController();
