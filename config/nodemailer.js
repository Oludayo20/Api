const nodemailer = require('nodemailer');
const emailConfig = require('./emailConfig');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: emailConfig.username,
      pass: emailConfig.password,
      clientId: emailConfig.clientId,
      clientSecret: emailConfig.clientSec,
      refreshToken: emailConfig.refreshToken
    }
  });

  const mailOptions = {
    from: options.from,
    to: options.to,
    subject: options.subject,
    html: options.text
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });

  transporter.verify((err, success) => {
    if (err) {
      console.log(err);
    } else console.log(success);
  });
};

module.exports = sendEmail;
