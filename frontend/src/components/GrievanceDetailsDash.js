import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ResponseForm from "./ResponseForm";

const GrievanceDetailsDash = () => {
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [sendmail, setSendMail] = useState("hod");
  const [customEmail, setCustomEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sentEmails, setSentEmails] = useState([]);
  const [emailResponses, setEmailResponses] = useState([]);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { applicationNumber } = location.state || {};

        if (!applicationNumber) {
          throw new Error("Missing application number");
        }
        setLoading(true);
        const data = await fetchGrievance(applicationNumber);
        setGrievance(data);

        // Fetch email responses after getting grievance details
        if (data && data.applicationNumber) {
          fetchEmailResponses(data.applicationNumber);
        }
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state, refreshCount]);

  // Add auto-refresh for responses
  useEffect(() => {
    // Set up auto-refresh for responses every 30 seconds
    if (grievance && grievance.applicationNumber) {
      const intervalId = setInterval(() => {
        console.log("Auto-refreshing responses...");
        fetchEmailResponses(grievance.applicationNumber);
      }, 30000); // 30 seconds

      return () => clearInterval(intervalId);
    }
  }, [grievance]);

  // Function to manually refresh responses
  const refreshResponses = () => {
    setRefreshCount((count) => count + 1);
  };

  // Function to fetch email responses for a grievance
  const fetchEmailResponses = async (applicationNumber) => {
    try {
      setLoadingResponses(true);
      let responseData = [];

      // Try to fetch responses from the server
      try {
        const response = await fetch(
          `http://localhost:5000/grievance/${applicationNumber}/responses`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 5000, // Add timeout to prevent long waiting
          }
        );

        if (response.ok) {
          const data = await response.json();
          responseData = data.responses || [];
          console.log("Fetched responses from server:", responseData);
        } else {
          console.log("Responses endpoint returned status:", response.status);
          // If the endpoint doesn't exist or fails, we'll use local data below
        }
      } catch (err) {
        console.warn("Could not fetch responses from server:", err.message);
        // Continue with local data as fallback
      }

      // Check if we have any local responses saved
      try {
        // Get all localStorage keys
        const keys = Object.keys(localStorage);

        // Filter keys that match our pattern
        const responseKeys = keys.filter((key) =>
          key.startsWith(`response_${applicationNumber}`)
        );

        // Process each key
        for (const key of responseKeys) {
          const localResponse = localStorage.getItem(key);
          if (localResponse) {
            try {
              const parsedResponse = JSON.parse(localResponse);
              // Make sure it has the right fields
              const formattedResponse = {
                id: `local-${Date.now()}-${Math.random()
                  .toString(36)
                  .substr(2, 5)}`,
                from: parsedResponse.from || "Admin",
                email: parsedResponse.email || "admin@example.com",
                message: parsedResponse.message,
                timestamp: new Date(parsedResponse.timestamp),
                activityType: "EmailResponse",
              };

              // Add the local response if it's not already in the server data
              const exists = responseData.some(
                (r) =>
                  r.message === formattedResponse.message &&
                  r.from === formattedResponse.from
              );

              if (!exists) {
                responseData.unshift(formattedResponse);
              }
            } catch (parseErr) {
              console.error("Error parsing local response:", parseErr);
            }
          }
        }
      } catch (storageErr) {
        console.error("Error accessing localStorage:", storageErr);
      }

      // If we still have no data and we're in development, add some mock data
      if (responseData.length === 0 && process.env.NODE_ENV !== "production") {
        console.log("Using mock data for testing");
        responseData = [
          {
            id: "resp-1",
            from: "Head of Department",
            email: "hod@example.com",
            message:
              "We've reviewed this grievance and it will be addressed in our next department meeting.",
            timestamp: new Date(Date.now() - 86400000), // 1 day ago
            activityType: "EmailResponse",
          },
          {
            id: "resp-2",
            from: "Clerk Office",
            email: "clerk@example.com",
            message:
              "The documents for this grievance have been processed and forwarded to the appropriate department.",
            timestamp: new Date(Date.now() - 172800000), // 2 days ago
            activityType: "EmailResponse",
          },
        ];
      }

      // Update state with all the responses
      setEmailResponses(responseData);
    } catch (err) {
      console.error("Error fetching email responses:", err);
      // Don't show an error to the user - just fail silently for this optional feature
    } finally {
      setLoadingResponses(false);
    }
  };

  const fetchGrievance = async (appNumber) => {
    try {
      const response = await fetch(
        `http://localhost:5000/grievance/${appNumber}`
      );

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Received non-JSON response:", text);
        throw new Error("Expected JSON, got something else");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      setGrievance(null);
    }
  };

  const MailMap = {
    hod: "powarakanksha03@gmail.com",
    principal: "riteshshinde4876@gmail.com",
    clerk: "rutujara08@gmail.com",
    exam: "salonipatil0706@gmail.com",
  };

  const authorityLabels = {
    hod: "Head of Department",
    principal: "Principal",
    clerk: "Clerk Office",
    exam: "Exam Section",
    other: "Custom Email",
  };

  const handleResolve = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/grievance/${grievance.applicationNumber}/resolve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resolve grievance");
      }

      const data = await response.json();
      console.log("Grievance resolved:", data);

      // Update local state
      setGrievance((prev) => ({
        ...prev,
        resolved: "true",
        resolvedAt: new Date(),
      }));
    } catch (err) {
      console.error("Error resolving grievance:", err);
    }
  };

  const handleReject = async () => {
    try {
      if (!rejectReason.trim()) {
        alert("Please provide a reason for rejection.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/grievance/${grievance.applicationNumber}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason: rejectReason }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject grievance");
      }

      const data = await response.json();
      console.log("Grievance rejected:", data);

      // Reset modal and refetch
      setShowRejectModal(false);
      setRejectReason("");
      setGrievance((prev) => ({
        ...prev,
        resolved: "reject",
        rejectedAt: new Date(),
        reason: rejectReason,
      }));
    } catch (err) {
      console.error("Error rejecting grievance:", err);
    }
  };

  // Function to check if email service is properly configured
  const checkEmailConfig = async () => {
    try {
      const response = await fetch("http://localhost:5000/verify-email-config");

      if (!response.ok) {
        throw new Error(`Email configuration check failed: ${response.status}`);
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Error checking email configuration:", error);
      return false;
    }
  };

  // Function to attempt sending the email with retries
  const attemptSendEmail = async (requestData, retryCount = 0) => {
    try {
      // Send email via API endpoint
      const controller = new AbortController();
      const signal = controller.signal;

      // Set a timeout to abort the request if it takes too long
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

      try {
        const response = await fetch(
          "http://localhost:5000/send-verification-email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
            signal: signal,
          }
        );

        // Clear the timeout if the request completes
        clearTimeout(timeoutId);

        if (!response.ok) {
          const contentType = response.headers.get("content-type");
          console.log("Response status:", response.status);
          console.log("Content-Type:", contentType);

          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to send email");
          } else {
            // Handle non-JSON responses
            const errorText = await response.text();
            console.error("Non-JSON error response:", errorText);
            throw new Error(`Server error: ${response.status}`);
          }
        }

        // Get the response data
        const data = await response.json();
        console.log("Email sent successfully:", data);
        return data;
      } catch (fetchError) {
        // Clear the timeout to avoid memory leaks
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (err) {
      // Handle abort errors separately
      if (err.name === "AbortError") {
        console.log("Request timed out");
        throw new Error("Email request timed out. Please try again.");
      }

      // If it's a network error and we haven't retried too many times
      if (
        (err.message.includes("NetworkError") ||
          err.message.includes("Failed to fetch")) &&
        retryCount < 2
      ) {
        console.log(`Network error, retrying (${retryCount + 1}/3)...`);
        return new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
          attemptSendEmail(requestData, retryCount + 1)
        );
      }
      throw err;
    }
  };

  const handleSendMail = async () => {
    try {
      setSendingEmail(true);
      // Determine email recipient based on selected authority
      const emailTo = sendmail === "other" ? customEmail : MailMap[sendmail];
      const authorityName =
        sendmail === "other" ? "Custom Email" : authorityLabels[sendmail];

      // Validate email input
      if (sendmail === "other" && !customEmail.trim()) {
        alert("Please enter an email address");
        setSendingEmail(false);
        return;
      }

      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTo)) {
        alert("Please enter a valid email address");
        setSendingEmail(false);
        return;
      }

      // Check if email service is properly configured
      const isEmailConfigValid = await checkEmailConfig();
      if (!isEmailConfigValid) {
        alert(
          "The email service is not properly configured. Please contact the administrator."
        );
        setSendingEmail(false);
        return;
      }

      // Log for debugging purposes
      console.log(
        "Sending email to:",
        emailTo,
        "for application:",
        grievance.applicationNumber
      );

      // Prepare the request data
      const requestData = {
        to: emailTo,
        applicationNumber: grievance.applicationNumber,
        subject: `Grievance Verification: ${grievance.applicationNumber}`,
        grievanceType: grievance.grievanceType,
        department: grievance.department,
      };

      // Display a sending status message
      const statusMessage = document.createElement("div");
      statusMessage.className =
        "fixed top-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded z-50";
      statusMessage.innerHTML = `
        <div class="flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Sending email to ${authorityName}...</span>
        </div>
      `;
      document.body.appendChild(statusMessage);

      try {
        // Attempt to send the email (with retries)
        const emailResult = await attemptSendEmail(requestData);

        // Remove the status message
        document.body.removeChild(statusMessage);

        // Add this email to the sent emails list
        const newEmailActivity = {
          to: authorityName,
          email: emailTo,
          timestamp: new Date(),
          activityType: "EmailSent",
          description: `Email sent to ${authorityName} regarding ${grievance.grievanceType} grievance`,
        };

        setSentEmails((prev) => [...prev, newEmailActivity]);

        // Reset form if needed
        if (sendmail === "other") {
          setCustomEmail("");
        }

        // Refresh responses after sending email
        setTimeout(() => {
          fetchEmailResponses(grievance.applicationNumber);
        }, 1000);

        // Show success message
        const successMessage = document.createElement("div");
        successMessage.className =
          "fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50";
        successMessage.innerHTML = `
          <div class="flex items-center">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Email sent successfully!</span>
          </div>
        `;
        document.body.appendChild(successMessage);

        // Remove success message after 3 seconds
        setTimeout(() => {
          document.body.removeChild(successMessage);
        }, 3000);
      } catch (err) {
        // Remove the status message
        if (document.body.contains(statusMessage)) {
          document.body.removeChild(statusMessage);
        }

        // Show error message
        const errorMessage = document.createElement("div");
        errorMessage.className =
          "fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50";
        errorMessage.innerHTML = `
          <div class="flex items-center">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span>${err.message}</span>
          </div>
        `;
        document.body.appendChild(errorMessage);

        // Remove error message after 5 seconds
        setTimeout(() => {
          if (document.body.contains(errorMessage)) {
            document.body.removeChild(errorMessage);
          }
        }, 5000);

        throw err;
      }
    } catch (err) {
      console.error("Error sending verification email:", err);

      // Show a more specific error message to the user
      if (
        err.message.includes("NetworkError") ||
        err.message.includes("Failed to fetch")
      ) {
        alert(
          "Network error: Please check your internet connection and try again."
        );
      } else if (err.message.includes("404")) {
        alert(
          "Server error: The email service is currently unavailable. Please try again later."
        );
      } else if (err.message.includes("timed out")) {
        alert("Request timed out. Please try again later.");
      } else {
        alert("Failed to send email: " + err.message);
      }
    } finally {
      setSendingEmail(false);
    }
  };

  const formattedDate = (dateObj) => {
    if (!dateObj) return ""; // Handle invalid dates gracefully
    const obj = new Date(dateObj);
    const date = obj.toLocaleDateString("en-GB");
    const time = obj.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${date} ${time}`;
  };

  // Render an activity card for grievance activity timeline
  const ActivityCard = ({ activity }) => {
    // Use the timestamp from the activity, or fall back to current date
    const timestamp = activity.timestamp
      ? new Date(activity.timestamp)
      : new Date();
    const formattedDate = timestamp.toLocaleString();

    // Determine activity type from the activity object or default to "Updated"
    const activityType =
      activity.activityType ||
      (activity.from ? "EmailResponse" : activity.to ? "EmailSent" : "Updated");

    // Different styles based on activity type
    const getActivityStyle = () => {
      switch (activityType) {
        case "Created":
          return {
            bg: "bg-green-50",
            border: "border-green-200",
            icon: (
              <div className="bg-green-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            ),
            label: "Created",
          };
        case "Resolved":
          return {
            bg: "bg-blue-50",
            border: "border-blue-200",
            icon: (
              <div className="bg-blue-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            ),
            label: "Resolved",
          };
        case "Rejected":
          return {
            bg: "bg-red-50",
            border: "border-red-200",
            icon: (
              <div className="bg-red-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            ),
            label: "Rejected",
          };
        case "EmailSent":
          return {
            bg: "bg-purple-50",
            border: "border-purple-200",
            icon: (
              <div className="bg-purple-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            ),
            label: "Email Sent",
          };
        case "EmailResponse":
          return {
            bg: "bg-indigo-50",
            border: "border-indigo-200",
            icon: (
              <div className="bg-indigo-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
              </div>
            ),
            label: "Response",
          };
        default:
          return {
            bg: "bg-gray-50",
            border: "border-gray-200",
            icon: (
              <div className="bg-gray-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            ),
            label: "Updated",
          };
      }
    };

    const style = getActivityStyle();

    // Get the appropriate content based on activity type
    const getActivityContent = () => {
      if (activity.description) {
        return activity.description;
      } else if (activity.message) {
        return activity.message;
      } else if (activity.from) {
        return `Response from ${activity.from} (${activity.email})`;
      } else if (activity.to) {
        return `Email sent to ${activity.to} (${activity.email})`;
      }
      return "Activity recorded";
    };

    return (
      <div
        className={`p-4 rounded-lg border ${style.border} ${style.bg} hover:shadow-md transition-all mb-3`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">{style.icon}</div>
          <div className="flex-1">
            <div className="flex flex-wrap justify-between items-start mb-1">
              <div className="font-medium text-gray-800">
                {getActivityContent()}
              </div>
              <div
                className="rounded text-xs font-medium py-1 px-2"
                style={{ backgroundColor: `${style.border}` }}
              >
                {style.label}
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">{formattedDate}</div>
          </div>
        </div>
      </div>
    );
  };

  // Add a function to save a response to a grievance
  const handleSaveResponse = async (responseData) => {
    try {
      setLoadingResponses(true);

      // Create a response object
      const response = {
        from: "Admin",
        email: "admin@example.com",
        message: responseData.message,
        timestamp: new Date(),
        activityType: "EmailResponse",
        applicationNumber: grievance.applicationNumber,
      };

      // Try to save to the server if the endpoint exists
      try {
        const apiResponse = await fetch(
          `http://localhost:5000/grievance/${grievance.applicationNumber}/response`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(response),
          }
        );

        if (apiResponse.ok) {
          console.log("Response saved to server successfully");
        } else {
          // If server endpoint not implemented, save locally
          console.log("Server endpoint returned status:", apiResponse.status);
          throw new Error("Server endpoint not available");
        }
      } catch (err) {
        console.log("Saving response locally as fallback:", err.message);
        // Save to local storage as a fallback
        localStorage.setItem(
          `response_${grievance.applicationNumber}`,
          JSON.stringify(response)
        );
      }

      // Add to UI immediately
      setEmailResponses((prev) => [response, ...prev]);

      // Return success
      return true;
    } catch (err) {
      console.error("Error saving response:", err);
      return false;
    } finally {
      setLoadingResponses(false);
    }
  };

  // Simple response form component
  const AdminResponseForm = () => {
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!message.trim()) return;

      setSubmitting(true);
      const success = await handleSaveResponse({ message });
      setSubmitting(false);

      if (success) {
        setMessage("");
      }
    };

    return (
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 mb-6">
        <h3 className="text-gray-800 font-medium mb-3">Add Response</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your response..."
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
          <button
            type="submit"
            disabled={submitting}
            className={`inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save Response"
            )}
          </button>
        </form>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="text-center p-8 bg-white shadow-md rounded-lg">
          <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading grievance details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="w-full max-w-md bg-red-50 p-6 rounded-lg border border-red-200 text-center shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-700 mb-2">
            Error Occurred
          </h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!grievance) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="w-full max-w-md bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center shadow-md">
          <div className="text-yellow-500 text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-yellow-700 mb-2">
            No Data Found
          </h2>
          <p className="text-yellow-600">No grievance details were found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full mt-20">
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="p-4 bg-white rounded-lg shadow-lg">
            <p className="text-xl font-semibold mb-2">
              Loading grievance details...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full animate-pulse"
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="p-4 bg-white rounded-lg shadow-lg">
            <p className="text-xl text-red-600 font-semibold mb-2">Error</p>
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          {/* Left column - Grievance details */}
          <div className="lg:col-span-2 overflow-y-auto pr-4 h-[calc(100vh-150px)]">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Grievance Details
                </h2>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    grievance?.status === "Resolved"
                      ? "bg-green-100 text-green-800"
                      : grievance?.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : grievance?.status === "Under Review"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {grievance.resolved === "true"
                    ? "Resolved"
                    : grievance.resolved === "false"
                    ? "Pending"
                    : grievance.resolved === "scrutiny"
                    ? "Under Review"
                    : "Rejected"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Email
                    </p>
                    <p className="text-gray-800">{grievance?.email}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Department
                    </p>
                    <p className="text-gray-800">{grievance?.department}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Grievance Type
                    </p>
                    <p className="text-gray-800">{grievance?.grievanceType}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Application Number
                    </p>
                    <p className="text-gray-800">
                      {grievance?.applicationNumber}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Created On
                    </p>
                    <p className="text-gray-800">
                      {formattedDate(grievance.createdAt)}
                    </p>
                  </div>
                  {grievance?.dateResolved && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Resolved On
                      </p>
                      <p className="text-gray-800">
                        {formattedDate(grievance?.resolvedAt)}
                      </p>
                    </div>
                  )}
                  {grievance.rejectedAt && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Rejected On
                      </p>
                      <p className="text-gray-800">
                        {formattedDate(grievance.rejectedAt)}
                      </p>
                    </div>
                  )}
                  {grievance.reason && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Rejection Reason
                      </p>
                      <p className="text-red-600">{grievance.reason}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Description
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {grievance?.description}
                  </p>
                </div>
              </div>

              {grievance?.status !== "Resolved" &&
                grievance?.status !== "Rejected" && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleResolve()}
                      className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Resolve Grievance
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md shadow-sm transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Reject Grievance
                    </button>
                  </div>
                )}
            </div>
          </div>

          {/* Right column - Activity and emails */}
          <div className="bg-white rounded-lg shadow-md p-6 overflow-y-auto h-[calc(100vh-150px)]">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Grievance Activity
            </h2>

            {grievance.resolved !== "true" &&
              grievance.resolved !== "reject" && (
                <div className="mb-6">
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 mb-4">
                    <h3 className="text-gray-800 font-medium mb-3">
                      Send Verification Email
                    </h3>
                    <div className="flex flex-col gap-3">
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Authority
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={sendmail}
                          onChange={(e) => setSendMail(e.target.value)}
                        >
                          {Object.entries(authorityLabels).map(
                            ([key, label]) => (
                              <option key={key} value={key}>
                                {label}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      {sendmail === "other" && (
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Custom Email Address
                          </label>
                          <input
                            type="email"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter email address"
                            value={customEmail}
                            onChange={(e) => setCustomEmail(e.target.value)}
                          />
                        </div>
                      )}

                      <button
                        onClick={handleSendMail}
                        disabled={sendingEmail}
                        className={`inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors ${
                          sendingEmail ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {sendingEmail ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            Send Email
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            {/* Email Responses */}
            {grievance.resolved !== "reject" && <AdminResponseForm />}

            <div className="flex justify-between items-center mb-3">
              <h3 className="text-gray-800 font-medium flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                  />
                </svg>
                Responses & Activity
              </h3>
              <button
                onClick={refreshResponses}
                className="text-blue-600 hover:text-blue-800 transition-colors flex items-center text-sm"
                disabled={loadingResponses}
              >
                {loadingResponses ? (
                  <svg
                    className="animate-spin h-4 w-4 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                )}
                {loadingResponses ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {/* Combine email responses and sent emails for timeline */}
            {[...(emailResponses || []), ...(sentEmails || [])].length > 0 ? (
              <div className="space-y-3">
                {[...(emailResponses || []), ...(sentEmails || [])]
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map((activity, index) => (
                    <ActivityCard key={index} activity={activity} />
                  ))}
              </div>
            ) : (
              <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="text-gray-600">No activity recorded yet.</p>
                <p className="text-gray-500 text-sm mt-2">
                  Activity will appear here when you send verification emails or
                  receive responses.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-lg w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Reject Grievance
            </h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this grievance.
            </p>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Rejection reason..."
              rows="4"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md shadow-sm transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrievanceDetailsDash;
