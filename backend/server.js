require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const mongoose = require("mongoose");
const Grievance = require("./models/grievance");
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

const mongoURI = process.env.MONGODB_URI;
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateApplicationNumber = () => {
  return `GRV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
};


// Route to handle grievance form submission
app.post("/grievance", async (req, res) => {
  try {
    const { name, email, grievanceType, description } = req.body;
    const applicationNumber = generateApplicationNumber(); // Generate once here

    // Create and save grievance first
    const lowercaseData = Object.keys(req.body).reduce((acc, key) => {
      acc[key] = typeof req.body[key] === "string" ? req.body[key].toLowerCase() : req.body[key];
      return acc;
    }, {});

    const newGrievance = new Grievance({
      ...lowercaseData,
      applicationNumber, // Use the same application number
    });

    await newGrievance.save();

    // Then send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Grievance Application Submitted",
      text: `Dear ${name},\n\nYour grievance has been successfully submitted. Here are the details:\n\n
      Application Number: ${applicationNumber}
      Grievance Type: ${grievanceType}
      Description: ${description}\n\n
      We will address your grievance as soon as possible.\n\nThank you!\nGrievanceBox Support Team`,
    };

    await transporter.sendMail(mailOptions);

    // Send single response
    res.status(201).json({
      message: "Grievance submitted successfully!",
      applicationNumber: applicationNumber,
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ 
      message: "An error occurred while processing your request",
      error: error.message 
    });
  }
});


app.get("/all-grievances", async (req, res) => {
  try {
    const grievances = await Grievance.find();
    res.status(200).json(grievances);
  } catch (error) {
    res.status(500).json({ message: "Error fetching grievances", error });
  }
});


mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB Database");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Database:", err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("GrievanceBox API is running");
});
