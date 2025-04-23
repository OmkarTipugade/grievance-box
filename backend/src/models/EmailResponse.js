const mongoose = require("mongoose");

const emailResponseSchema = new mongoose.Schema(
  {
    applicationNumber: {
      type: String,
      required: true,
      index: true,
    },
    from: {
      type: String, // Name or title of the responder (e.g., "Head of Department")
      required: true,
    },
    email: {
      type: String, // Email of the responder
      required: true,
    },
    message: {
      type: String, // The response message content
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create indexes for faster queries
emailResponseSchema.index({ applicationNumber: 1, createdAt: -1 });

const EmailResponse = mongoose.model("EmailResponse", emailResponseSchema);

module.exports = EmailResponse;
