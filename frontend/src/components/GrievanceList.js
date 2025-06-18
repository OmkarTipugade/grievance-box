import React, { useEffect, useState } from "react";
import axios from "axios";

const GrievanceList = () => {
  const [grievances, setGrievances] = useState([]);

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const response = await axios.get(
          "https://grievance-box-xcbb.onrender.com/grievance/all"
        );
        setGrievances(response.data);
      } catch (error) {
        console.error("Error fetching grievances:", error);
      }
    };
    fetchGrievances();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Submitted Grievances</h2>
      <ul>
        {grievances.map((grievance) => (
          <li key={grievance._id} className="border p-4 my-2">
            <p>
              <strong>Application No.:</strong> {grievance.applicationNumber}
            </p>
            <p>
              <strong>Name:</strong> {grievance.name}
            </p>
            <p>
              <strong>PRN:</strong> {grievance.prn}
            </p>
            <p>
              <strong>Email:</strong> {grievance.email}
            </p>
            <p>
              <strong>Type:</strong> {grievance.grievanceType}
            </p>
            <p>
              <strong>Description:</strong> {grievance.description}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(grievance.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong>
              {grievance.resolved ? "Resolved" : "Under Investigation"}
            </p>
            {grievance.resolved && (
              <p className="text-green-500">
                Resolved: {new Date(grievance.resolvedAt).toLocaleString()}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GrievanceList;
