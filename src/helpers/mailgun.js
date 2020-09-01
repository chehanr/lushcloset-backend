const mailgun = require('mailgun-js');

const serverConfig = require('../configs/server');
const logger = require('../loaders/winston');

module.exports = class MailgunHelper {
  constructor() {
    this.mailgun = mailgun({
      apiKey: serverConfig.mailgunApiKey,
      publicApiKey: serverConfig.mailgunPublicKey,
      domain: serverConfig.mailgunDomain,
    });
  }

  sendMail(from, to, subject, text, html) {
    this.mailgun
      .messages()
      .send({ from, to, subject, text, html })
      .then((body) => {
        logger.info(`Mailgun (sent): ${body.id}`);
      })
      .catch((error) => {
        logger.error(error);
      });
  }
};
