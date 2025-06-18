import React, { useState } from "react";
import axios from "axios";

const GrievanceForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    prn: "",
    email: "",
    department: "",
    grievanceType: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const grievanceTypes = [
    "Academic",
    "Administrative",
    "Hostel",
    "Disciplinary",
    "Other",
  ];

  const departments = [
    "First Year",
    "Computer Science Eng.",
    "Civil Eng.",
    "Electrical Eng.",
    "Data Science Eng.",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      console.log("Submitting form data:", formData);
      const response = await axios.post(
        "https://grievance-box-xcbb.onrender.com/grievance",
        formData
      );

      console.log("Response received:", response.data);

      if (response.data && response.data.applicationNumber) {
        setApplicationNumber(response.data.applicationNumber);
        setSubmitted(true);
        console.log("Application number set:", response.data.applicationNumber);
        console.log("Submitted state set to:", true);
      } else {
        console.error("No application number received:", response.data);
        setErrorMessage(
          "Submission successful but no application number received."
        );
      }

      // Reset form
      setFormData({
        name: "",
        prn: "",
        email: "",
        department: "",
        grievanceType: "",
        description: "",
      });
    } catch (error) {
      console.error("Error submitting grievance:", error);
      setErrorMessage("Failed to submit grievance. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClosePopup = () => {
    setSubmitted(false);
    setApplicationNumber("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10 sm:max-w-xl md:max-w-2xl">
        <h2 className="text-4xl font-semibold text-gray-800 mb-4 text-center sm:text-4xl">
          Grievance Form
        </h2>

        {/* Success Popup */}
        {submitted && applicationNumber && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-2xl font-bold text-green-600 mb-4">
                Grievance Submitted Successfully!
              </h3>
              <p className="mb-4">
                Thank you for submitting your grievance. We will address it
                promptly.
              </p>
              <div className="bg-gray-100 p-4 rounded-md mb-4">
                <p className="font-semibold">Your Application Number:</p>
                <p className="text-xl font-bold text-blue-700">
                  {applicationNumber}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Please save this number for future reference.
                </p>
              </div>
              <button
                onClick={handleClosePopup}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md shadow hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}

        <form className="space-y-4 text-base" onSubmit={handleSubmit}>
          <div className="gf-field flex flex-col">
            <label
              htmlFor="name"
              className="font-medium text-gray-700 text-left"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="gf-field flex flex-col">
            <label
              htmlFor="email"
              className="font-medium text-gray-700 text-left"
            >
              PRN No. <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="prn"
              name="prn"
              max={9999999999}
              value={formData.prn}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 10) {
                  handleChange(e);
                }
              }}
              required
              placeholder="Enter your PRN No."
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="gf-field flex flex-col">
            <label
              htmlFor="email"
              className="font-medium text-gray-700 text-left"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your Email"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="gf-field flex flex-col">
            <label
              htmlFor="department"
              className="font-medium text-gray-700 text-left"
            >
              Department <span className="text-red-500">*</span>
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select Department</option>
              {departments.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="gf-field flex flex-col">
            <label
              htmlFor="grievanceType"
              className="font-medium text-gray-700 text-left"
            >
              Grievance Type <span className="text-red-500">*</span>
            </label>
            <select
              id="grievanceType"
              name="grievanceType"
              value={formData.grievanceType}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select Grievance Type</option>
              {grievanceTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="gf-field flex flex-col">
            <label
              htmlFor="description"
              className="font-medium text-gray-700 text-left"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe your grievance in detail"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md shadow transition duration-300 flex items-center justify-center ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GrievanceForm;
