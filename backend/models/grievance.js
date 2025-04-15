const mongoose = require("mongoose");

const grievanceSchema = new mongoose.Schema({
  applicationNumber: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  prn: { type: String, required: true },
  email: { type: String, required: true },
  grievanceType: { type: String, required: true },
  department: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  resolved: {
    type: String,
    enum: ["false", "true", "scrutiny"],
    default: "false",
  },
  resolvedAt: { type: Date },
});

module.exports = mongoose.model("Grievance", grievanceSchema);
