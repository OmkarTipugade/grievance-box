const app = require("./app");
const connectDB = require("./config/database");
const { verifyTransport } = require("./services/emailService");

// Port configuration
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Verify email transport
    await verifyTransport();

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
