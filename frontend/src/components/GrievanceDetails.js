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

  const formattedDate = (dateObj) => {
    const obj = new Date(dateObj);
    const date = obj.toLocaleDateString("en-GB");
    const time = obj.toLocaleTimeString("en-GB");
    return { date, time };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "true":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          border: "border-green-200",
          icon: "✓",
          label: "Resolved",
        };
      case "false":
        return {
          bg: "bg-amber-100",
          text: "text-amber-700",
          border: "border-amber-200",
          icon: "⌛",
          label: "Pending",
        };
      case "scrutiny":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: "🔍",
          label: "Under Review",
        };
      default:
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          border: "border-red-200",
          icon: "✗",
          label: "Rejected",
        };
    }
  };

  const Wrapper = ({ children }) => (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">{children}</div>
    </div>
  );

  if (loading) {
    return (
      <Wrapper>
        <div className="text-center p-8 bg-white shadow-md rounded-xl">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading grievance details...</p>
        </div>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-center shadow-sm">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-red-800 font-medium text-lg mb-2">
            Error Occurred
          </h3>
          <p className="text-red-700">{error}</p>
        </div>
      </Wrapper>
    );
  }

  if (!grievance) {
    return (
      <Wrapper>
        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 text-center shadow-sm">
          <div className="text-yellow-500 text-5xl mb-4">📭</div>
          <h3 className="text-yellow-800 font-medium text-lg mb-2">
            No Data Available
          </h3>
          <p className="text-yellow-700">
            No grievance details were found for this request
          </p>
        </div>
      </Wrapper>
    );
  }

  const statusInfo = getStatusColor(grievance.resolved);

  return (
    <Wrapper>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 mt-20">
        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-5">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Grievance Details</h2>
            <div
              className={`${statusInfo.bg} ${statusInfo.text} px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1 border ${statusInfo.border}`}
            >
              <span>{statusInfo.icon}</span>
              <span>{statusInfo.label}</span>
            </div>
          </div>
          <p className="text-green-100 mt-2">
            Application #{grievance.applicationNumber}
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InfoCard label="Name" value={grievance.name} />
            <InfoCard label="PRN" value={grievance.prn} />
            <InfoCard label="Email" value={grievance.email} />
            <InfoCard label="Department" value={grievance.department} />
            <InfoCard
              label="Grievance Type"
              value={grievance.grievanceType}
              className="capitalize"
            />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Description
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-60 overflow-y-auto scrollbar">
              <p className="text-gray-800 whitespace-pre-wrap">
                {grievance.description}
              </p>
            </div>
          </div>

          {grievance.reason && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Rejection Reason
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-48 overflow-y-auto scrollbar">
                <p className="text-gray-800">{grievance.reason}</p>
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-4">
            {grievance.resolvedAt && (
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <span className="mr-2">✓ Resolved on:</span>
                <span className="font-medium">
                  {formattedDate(grievance.resolvedAt).date}
                </span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="font-medium">
                  {formattedDate(grievance.resolvedAt).time}
                </span>
              </div>
            )}

            {grievance.rejectedAt && (
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">✗ Rejected on:</span>
                <span className="font-medium">
                  {formattedDate(grievance.rejectedAt).date}
                </span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="font-medium">
                  {formattedDate(grievance.rejectedAt).time}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

const InfoCard = ({ label, value, className = "" }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500">{label}</span>
    <span
      className={`text-gray-800 font-medium ${className} overflow-x-auto scrollbar max-w-full`}
    >
      {value}
    </span>
  </div>
);

export default GrievanceDetails;
