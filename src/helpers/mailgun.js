const mailgun = require('mailgun.js');

const serverConfig = require('../configs/server');
const logger = require('../loaders/winston');

module.exports = class MailgunHelper {
  constructor() {
    this.mailgun = mailgun.client({
      username: 'api',
      key: serverConfig.mailgunApiKey,
      public_key: serverConfig.mailgunPublicKey,
    });
    this.domain = serverConfig.mailgunDomain;
  }

  sendMail(from, to, subject, text, html) {
    this.mailgun.messages
      .create(this.domain, { from, to, subject, text, html })
      .then((message) => {
        logger.info(`Mailgun (sent): ${message.id}`);
      })
      .catch((error) => {
        logger.error(error);
      });
  }
};
