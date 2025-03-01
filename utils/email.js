const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //   2) Define Mail options

  const mailOptions = {
    from: 'Natours <natours.io>',
    to: options.email,
    subject: options.subject,
    message: options.message,
    // html:
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
