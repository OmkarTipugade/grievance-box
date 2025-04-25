const nodemailer = require("nodemailer");

/**
 * Creates a reusable transporter for sending emails
 * @returns {Object} Nodemailer transporter object
 */
const createTransporter = () => {
  console.log("Creating email transporter with:", process.env.EMAIL_USER);

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
      rejectUnauthorized: false,
    },
    debug: true,
    logger: true,
  });

  return transporter;
};

// Create a singleton transporter instance
let transporter = null;

/**
 * Gets the email transporter, creating it if necessary
 * @returns {Object} Nodemailer transporter
 */
const getTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
};

/**
 * Sends an email
 * @param {Object} mailOptions - Email options (to, from, subject, text, html)
 * @returns {Promise} Promise that resolves with result of email sending
 */
const sendEmail = async (mailOptions) => {
  try {
    // Make sure we have the required fields
    if (!mailOptions.to || !mailOptions.subject) {
      throw new Error("Missing required email fields");
    }

    // Set sender if not provided
    if (!mailOptions.from) {
      mailOptions.from = `"GrievanceBox Support" <${process.env.EMAIL_USER}>`;
    }

    console.log(`Attempting to send email to: ${mailOptions.to}`);
    const emailTransporter = getTransporter();

    // Send mail and get info
    const info = await emailTransporter.sendMail(mailOptions);

    console.log(`Email sent successfully! ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Verifies the email transport configuration
 * @returns {Promise<boolean>} True if verification succeeds
 */
const verifyTransport = async () => {
  try {
    const emailTransporter = getTransporter();
    await emailTransporter.verify();
    console.log("Email transport verification successful");
    return true;
  } catch (error) {
    console.error("Email transport verification failed:", error);
    return false;
  }
};

module.exports = {
  sendEmail,
  verifyTransport,
};
