const express = require("express");
const router = express.Router();
const grievanceController = require("../controllers/grievanceController");

// Health check for debugging route issues
router.get("/healthcheck", (req, res) => {
  res.status(200).json({ status: "ok", routes: "working" });
});

// Create a new grievance
router.post("/", grievanceController.createGrievance);

// Get all grievances
router.get("/all", grievanceController.getAllGrievances);

// Get a single grievance by application number
router.get("/:applicationNumber", grievanceController.getGrievanceByAppNumber);

// Get email responses for a grievance
router.get(
  "/:applicationNumber/responses",
  grievanceController.getEmailResponses
);

// Submit a response to a grievance verification email
router.post(
  "/:applicationNumber/respond",
  grievanceController.submitEmailResponse
);

// Resolve a grievance
router.patch(
  "/:applicationNumber/resolve",
  grievanceController.resolveGrievance
);

// Reject a grievance
router.patch("/:applicationNumber/reject", grievanceController.rejectGrievance);

// Mark grievance as under scrutiny
router.patch(
  "/:applicationNumber/scrutiny",
  grievanceController.markUnderScrutiny
);

// Update rejection reason
router.patch(
  "/:applicationNumber/reason",
  grievanceController.updateRejectionReason
);

// Delete all grievances
router.delete("/", grievanceController.deleteAllGrievances);

// Send verification email - Moving this endpoint up to avoid conflicts with other routes
router.post(
  "/send-verification-email",
  grievanceController.sendVerificationEmail
);

module.exports = router;
