const logger = require('../loaders/winston');

class BaseController {
  static successResponse(res, code, data) {
    return res.status(code).json({
      success: true,
      error: null,
      data: data,
    });
  }

  static errorResponse(res, code, error) {
    return res.status(code).json({
      success: false,
      error: error,
      data: null,
    });
  }

  ok(res, data) {
    return BaseController.successResponse(res, 200, data || 'OK');
  }

  created(res, data) {
    return BaseController.successResponse(res, 201, data || 'Created');
  }

  noContent(res, data) {
    return BaseController.successResponse(res, 204, data || 'No Content');
  }

  badRequest(res, data) {
    return BaseController.errorResponse(res, 400, data || 'Bad request');
  }

  unauthorized(res, data) {
    return BaseController.errorResponse(res, 401, data || 'Unauthorized');
  }

  forbidden(res, data) {
    return BaseController.errorResponse(res, 403, data || 'Forbidden');
  }

  notFound(res, data) {
    return BaseController.errorResponse(res, 404, data || 'Not found');
  }

  conflict(res, data) {
    return BaseController.errorResponse(res, 409, data || 'Conflict');
  }

  imATeapot(res, data) {
    return BaseController.errorResponse(res, 418, data || "I'm a teapot");
  }

  unprocessableEntity(res, data) {
    return BaseController.errorResponse(
      res,
      422,
      data || 'Unprocessable Entity'
    );
  }

  tooManyRequests(res, data) {
    return BaseController.errorResponse(res, 429, data || 'Too many requests');
  }

  fail(res, error) {
    logger.error(error);

    if (process.env.NODE_ENV === 'production') {
      return BaseController.errorResponse(res, 500, 'Internal Server Error');
    }

    return BaseController.errorResponse(
      res,
      500,
      error?.toString() || 'Internal Server Error'
    );
  }
}

module.exports = BaseController;
