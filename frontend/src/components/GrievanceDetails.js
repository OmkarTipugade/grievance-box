import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const GrievanceDetails = () => {
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state]);

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

  const Wrapper = ({ children }) => (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );

  if (loading) {
    return (
      <Wrapper>
        <div className="text-center p-6 bg-white shadow rounded">
          <p className="text-gray-600">Loading grievance details...</p>
        </div>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
          <p className="text-red-700">Error: {error}</p>
        </div>
      </Wrapper>
    );
  }

  if (!grievance) {
    return (
      <Wrapper>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center">
          <p className="text-yellow-700">No grievance details found</p>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-green-600 text-white px-6 py-4">
          <h2 className="text-xl font-bold">Grievance Details</h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-600">
              Application Number:
            </span>
            <span className="text-gray-800">{grievance.applicationNumber}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-600">Name:</span>
            <span className="text-gray-800">{grievance.name}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-600">PRN:</span>
            <span className="text-gray-800">{grievance.prn}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-600">Email:</span>
            <span className="text-gray-800">{grievance.email}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-600">Department:</span>
            <span className="text-gray-800">{grievance.department}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-600">Grievance Type:</span>
            <span className="capitalize text-gray-800">
              {grievance.grievanceType}
            </span>
          </div>

          <div className="border-b pb-2">
            <span className="font-medium text-gray-600">Description:</span>
            <p className="text-gray-800 mt-1">{grievance.description}</p>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Status:</span>
            <span
              className={`font-medium px-3 py-1 rounded-full text-sm ${
                grievance.resolved === "true"
                  ? "bg-green-100 text-green-500"
                  : grievance.resolved === "false"
                  ? "bg-red-100 text-red-500"
                  : "text-yellow-500"
              }`}
            >
              {grievance.resolved === "true"
                ? "Resolved"
                : grievance.resolved === "false"
                ? "Pending"
                : "Under Review"}
            </span>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default GrievanceDetails;
