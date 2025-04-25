const nodemailer = require("nodemailer");

const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Allows self-signed certificates
    },
    debug: true, // Show debug output
    logger: true, // Log information about the mail transport
  });

  return transporter;
};

module.exports = createTransporter;
