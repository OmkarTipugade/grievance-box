import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CheckGrievance = () => {
  const [applicationId, setApplicationId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Navigate to details page with the form data
    navigate("/details", {
      state: {
        applicationNumber: applicationId,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md sm:max-w-lg lg:max-w-xl">
        <h2 className="text-3xl sm:text-2xl font-bold text-center text-gray-800 mb-6">
          Check your grievance status
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="block text-gray-700 text-base sm:text-lg lg:text-xl font-medium mb-2">
              Application ID:
            </label>
            <input
              type="text" // Changed from password to text to make debugging easier
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-base sm:text-lg lg:text-xl disabled:bg-green-400"
          >
            {isSubmitting ? "Checking..." : "Check status"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckGrievance;
