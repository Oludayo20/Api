const nodemailer = require('nodemailer');
const emailConfig = require('./emailConfig');

const transport = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    type: 'OAuth2',
    user: emailConfig.username,
    pass: emailConfig.password,
    refreshToken: emailConfig.refreshToken
  }
});

module.exports.sendConfirmationEmil = async (
  username,
  email,
  confirmationCode
) => {
  console.log('check');
  await transport
    .sendMail({
      from: emailConfig.username,
      to: email,
      subject: 'Please confirm your account',
      html: `<h1>Email Confirmation</h1>
        <h2>Hello ${username}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:4000/confirm/${confirmationCode}> Click here</a>
        </div>`
    })
    .catch((err) => console.log(err));
};
