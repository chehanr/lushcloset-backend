const formidable = require('formidable');

const BaseController = require('../controllers/base');

/**
 * Stolen from https://github.com/utatti/express-formidable
 */
function formidableParser(opts, events) {
  return (req, res, next) => {
    const form = new formidable.IncomingForm();

    Object.assign(form.options, opts);

    let manageOnError = false;

    if (events) {
      events.forEach((event) => {
        manageOnError = manageOnError || event.event === 'error';

        form.on(event.event, (...parameters) => {
          event.action(req, res, next, ...parameters);
        });
      });
    }

    if (!manageOnError) {
      form.on('error', (error) => {
        // TODO: Add better error responses.

        return new BaseController().fail(res, error);
      });
    }

    form.parse(req, (error, fields, files) => {
      if (error) return next(error);

      Object.assign(req, { fields, files });

      return next();
    });
  };
}

module.exports = formidableParser;
