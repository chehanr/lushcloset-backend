const jsonwebtoken = require('jsonwebtoken');

const MailgunHelper = require('../helpers/mailgun');
const serverConfig = require('../configs/server');

const fromEmails = {
  userVerifiy: `Account verification <noreply@${serverConfig.mailgunDomain}>`,
};

module.exports = {
  sendEmailVerification(userObj, emailVerifySecret) {
    const verifyData = {
      id: userObj.id,
      email: userObj.email,
    };

    const verifyToken = jsonwebtoken.sign(verifyData, emailVerifySecret, {
      expiresIn: serverConfig.emailVerifyExpirationTime,
      algorithm: 'HS256',
    });

    const verifyLink = `${serverConfig.url}${serverConfig.emailVerifyPath}?userId=${userObj.id}&token=${verifyToken}`;

    const mailGun = new MailgunHelper();

    const html = `
    <h1> Verify your LushCloset Account </h1>
    <a href="${verifyLink}" target="_blank">Verify email</a>
    `;

    const text = 'Verify your LushCloset Account';

    mailGun.sendMail(
      fromEmails.userVerifiy,
      [userObj.email],
      'Welcome!',
      text,
      html
    );
  },

  decodeEmailToken(token, key) {
    return jsonwebtoken.verify(token, key);
  },
};
