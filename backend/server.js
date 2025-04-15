const dotenv = require("dotenv");
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const mongoose = require("mongoose");
const Grievance = require("./models/grievance");
const PORT = process.env.PORT || 5000;

dotenv.config();

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
      acc[key] =
        typeof req.body[key] === "string"
          ? req.body[key].toLowerCase()
          : req.body[key];
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
      subject: "📬 Grievance Application Submitted Successfully!",
      text: `Dear ${name},
    
    ✅ We have received your grievance. Below are the details you submitted:
    
    🆔 Application Number: ${applicationNumber}
    📌 Grievance Type: ${grievanceType}
    📝 Description: ${description}
    
    Our team has started reviewing your concern. We aim to address your grievance as quickly and efficiently as possible.
    
    Thank you for reaching out to us and trusting GrievanceBox.
    
    Warm regards,  
    GrievanceBox Support Team`,
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
      error: error.message,
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

app.get("/grievance/:applicationNumber", async (req, res) => {
  const { applicationNumber } = req.params;
  try {
    const grievance = await Grievance.findOne({ applicationNumber });
    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }
    res.status(200).json(grievance);
  } catch (error) {
    res.status(500).json({ message: "Error fetching grievance", error });
  }
});
app.patch("/grievance/:applicationNumber/resolve", async (req, res) => {
  const { applicationNumber } = req.params;

  try {
    const updatedGrievance = await Grievance.findOneAndUpdate(
      { applicationNumber },
      { resolved: "true", resolvedAt: new Date() },
      { new: true }
    );

    if (!updatedGrievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: updatedGrievance.email,
      subject: "🎉 Grievance Resolved Successfully!",
      text: `Dear ${updatedGrievance.name},
    
    We are pleased to inform you that your grievance has been successfully resolved. Please find the resolution details below:
    
    📄 Application Number: ${updatedGrievance.applicationNumber}
    🏢 Department: ${updatedGrievance.department || "N/A"}
    📌 Grievance Type: ${updatedGrievance.grievanceType}
    📝 Description: ${updatedGrievance.description}
    ✅ Status: Resolved
    🕓 Resolved On: ${new Date().toLocaleString()}
    
    We hope that the resolution meets your expectations. If you have any further questions or concerns, feel free to reach out to us.
    
    Thank you for using GrievanceBox.
    
    Warm regards,  
    GrievanceBox Support Team
    `,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: "Grievance marked as resolved",
      grievance: updatedGrievance,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating grievance", error });
  }
});

app.patch("/grievance/:applicationNumber/scrutiny", async (req, res) => {
  const { applicationNumber } = req.params;

  try {
    const updatedGrievance = await Grievance.findOneAndUpdate(
      { applicationNumber },
      { resolved: "scrutiny" },
      { new: true }
    );

    if (!updatedGrievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    res.status(200).json({
      message: "Grievance marked as under scrutiny",
      grievance: updatedGrievance,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating grievance", error });
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
