const Grievance = require("../models/grievance");
const createTransporter = require("../config/email");
const generateApplicationNumber = require("../utils/generateApplicationNumber");
const EmailResponse = require("../models/EmailResponse");

// Get transporter
const transporter = createTransporter();

/**
 * Create a new grievance
 */
exports.createGrievance = async (req, res) => {
  try {
    const { name, email, grievanceType, description } = req.body;
    const applicationNumber = generateApplicationNumber();

    // Format data (convert string fields to lowercase)
    const lowercaseData = Object.keys(req.body).reduce((acc, key) => {
      acc[key] =
        typeof req.body[key] === "string"
          ? req.body[key].toLowerCase()
          : req.body[key];
      return acc;
    }, {});

    // Create and save new grievance
    const newGrievance = new Grievance({
      ...lowercaseData,
      applicationNumber,
    });

    await newGrievance.save();

    // Send confirmation email
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
};

/**
 * Get all grievances
 */
exports.getAllGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find();
    res.status(200).json(grievances);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching grievances", error: error.message });
  }
};

/**
 * Get a single grievance by application number
 */
exports.getGrievanceByAppNumber = async (req, res) => {
  const { applicationNumber } = req.params;
  try {
    const grievance = await Grievance.findOne({ applicationNumber });
    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }
    res.status(200).json(grievance);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching grievance", error: error.message });
  }
};

/**
 * Resolve a grievance
 */
exports.resolveGrievance = async (req, res) => {
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
    res
      .status(500)
      .json({ message: "Error updating grievance", error: error.message });
  }
};

/**
 * Reject a grievance
 */
exports.rejectGrievance = async (req, res) => {
  const { applicationNumber } = req.params;
  const { reason } = req.body;

  try {
    const updatedGrievance = await Grievance.findOneAndUpdate(
      { applicationNumber },
      { resolved: "reject", rejectedAt: new Date(), reason },
      { new: true }
    );

    if (!updatedGrievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: updatedGrievance.email,
      subject: "⚠️ Grievance Review Update - Rejected",
      text: `Dear ${updatedGrievance.name},
    
    We regret to inform you that after a thorough review, your submitted grievance could not be approved. Please find the grievance details below:
    
    📄 Application Number: ${updatedGrievance.applicationNumber}
    🏢 Department: ${updatedGrievance.department || "N/A"}
    📌 Grievance Type: ${updatedGrievance.grievanceType}
    📝 Description: ${updatedGrievance.description}
    ❌ Status: Rejected
    🕓 Reviewed On: ${new Date().toLocaleString()}
    📋 Reason: ${updatedGrievance.reason || "No reason provided"}
    
    We understand this may be disappointing, and we encourage you to reach out if you believe there has been a misunderstanding or if you would like to appeal this decision.
    
    Thank you for bringing your concern to our attention. Your feedback is valuable in helping us improve our services.
    
    Warm regards,  
    GrievanceBox Support Team
    `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Grievance marked as rejected",
      grievance: updatedGrievance,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating grievance", error: error.message });
  }
};

/**
 * Mark grievance as under scrutiny
 */
exports.markUnderScrutiny = async (req, res) => {
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
    res
      .status(500)
      .json({ message: "Error updating grievance", error: error.message });
  }
};

/**
 * Update rejection reason
 */
exports.updateRejectionReason = async (req, res) => {
  const { applicationNumber } = req.params;
  const { reason } = req.body;

  try {
    const updatedGrievance = await Grievance.findOneAndUpdate(
      { applicationNumber },
      { reason },
      { new: true }
    );

    if (!updatedGrievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    res.status(200).json({
      message: "Reason for rejection updated",
      grievance: updatedGrievance,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating grievance", error: error.message });
  }
};

/**
 * Delete all grievances
 */
exports.deleteAllGrievances = async (req, res) => {
  try {
    await Grievance.deleteMany({});
    res.status(200).json({ message: "All grievances deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting grievances", error: error.message });
  }
};

/**
 * Send verification email
 */
exports.sendVerificationEmail = async (req, res) => {
  try {
    const { to, applicationNumber } = req.body;

    if (!to || !applicationNumber) {
      return res
        .status(400)
        .json({ message: "Email address and application number are required" });
    }

    // Fetch grievance details
    const grievance = await Grievance.findOne({ applicationNumber });

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    // Create email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: `Grievance Verification Request: ${applicationNumber}`,
      text: `
Dear Concerned Department,

A grievance has been submitted that requires your verification and input. Please find the details below:

📄 Application Number: ${grievance.applicationNumber}
👤 Student Name: ${grievance.name}
🆔 PRN: ${grievance.prn || "Not provided"}
📧 Email: ${grievance.email}
🏢 Department: ${grievance.department || "Not specified"}
📌 Grievance Type: ${grievance.grievanceType}
📝 Description: ${grievance.description}
📊 Current Status: ${
        grievance.resolved === "true"
          ? "Resolved"
          : grievance.resolved === "reject"
          ? "Rejected"
          : grievance.resolved === "scrutiny"
          ? "Under Review"
          : "Pending"
      }

Please review this grievance and take appropriate action as per the institution's policy.

Thank you,
GrievanceBox Administration
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Verification email sent successfully" });
  } catch (error) {
    console.error("Error sending verification email:", error);
    res.status(500).json({
      message: "An error occurred while sending verification email",
      error: error.message,
    });
  }
};

/**
 * Get email responses for a grievance
 */
exports.getEmailResponses = async (req, res) => {
  try {
    const { applicationNumber } = req.params;

    // Validate that the grievance exists
    const grievance = await Grievance.findOne({ applicationNumber });
    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    // Find all responses for this grievance
    const responses = await EmailResponse.find({ applicationNumber }).sort({
      createdAt: -1,
    }); // Latest responses first

    res.status(200).json({
      success: true,
      responses,
    });
  } catch (error) {
    console.error("Error fetching email responses:", error);
    res.status(500).json({
      message: "Error fetching email responses",
      error: error.message,
    });
  }
};

/**
 * Submit a response to a grievance verification email
 */
exports.submitEmailResponse = async (req, res) => {
  try {
    const { applicationNumber } = req.params;
    const { from, email, message } = req.body;

    if (!from || !email || !message) {
      return res.status(400).json({
        message:
          "Missing required fields: from, email, and message are required",
      });
    }

    // Validate that the grievance exists
    const grievance = await Grievance.findOne({ applicationNumber });
    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    // Create a new response
    const emailResponse = new EmailResponse({
      applicationNumber,
      from,
      email,
      message,
      timestamp: new Date(),
    });

    await emailResponse.save();

    // Notify the student about the response
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: grievance.email,
      subject: `Response received on your grievance: ${applicationNumber}`,
      text: `
Dear ${grievance.name},

${from} has responded to your grievance (${applicationNumber}). Here's their message:

"${message}"

You can view the full details by logging into your grievance portal.

Regards,
GrievanceBox Team
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "Response submitted successfully",
      response: emailResponse,
    });
  } catch (error) {
    console.error("Error submitting email response:", error);
    res.status(500).json({
      message: "Error submitting email response",
      error: error.message,
    });
  }
};
