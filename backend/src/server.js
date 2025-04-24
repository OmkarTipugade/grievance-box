const app = require("./app");
const connectDB = require("./config/database");
const nodemailer = require("nodemailer");

// Port configuration
const PORT = process.env.PORT || 5000;

// Test email connection
const verifyEmailTransport = async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug: true,
    });

    const result = await transporter.verify();
    if (result) {
      console.log("Email transport verification successful");
    }
    return result;
  } catch (error) {
    console.error("Email transport verification failed:", error);
    return false;
  }
};

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Verify email transport
    await verifyEmailTransport();

    // Start Express server
    app.listen(PORT, () => {
      console.log(
        `Server running in ${
          process.env.NODE_ENV || "development"
        } mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

// Start the server
startServer();
