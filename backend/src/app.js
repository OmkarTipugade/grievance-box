const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const errorHandler = require("./middlewares/errorHandler");
const grievanceRoutes = require("./routes/grievanceRoutes");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Health check route
app.get("/", (req, res) => {
  res.send("GrievanceBox API is running");
});

// Routes
app.use("/grievance", grievanceRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
