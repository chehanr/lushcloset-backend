module.exports = (schema) => {
  return (req, res, next) => {
    const validation = {};

    if (schema.HEADERS) {
      validation.headers = schema.HEADERS.validate(req.headers);
    }

    if (schema.PARAMS) {
      validation.params = schema.PARAMS.validate(req.params);
    }

    if (schema.QUERY) {
      validation.query = schema.QUERY.validate(req.query);
    }

    if (schema.COOKIES) {
      validation.cookies = schema.COOKIES.validate(req.cookies);
    }

    if (schema.SIGNEDCOOKIES) {
      validation.signedCookies = schema.SIGNEDCOOKIES.validate(
        req.signedCookies
      );
    }

    if (schema.BODY) {
      validation.body = schema.BODY.validate(req.fields);
    }

    if (schema.FILES) {
      validation.files = schema.FILES.validate(req.files, {
        allowUnknown: true,
      });
    }

    req.validated = validation;

    next();
  };
};
