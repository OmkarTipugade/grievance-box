import React from "react";

const ShowGrievance = ({
  handleOverlayClick,
  closeOverlay,
  applicationNumber,
  grievanceType,
  department,
  resolved,
  createdAt,
  description,
  grievanceResolve,
  name,
  prn,
  email,
  resolvedAt,
  loading,
  setLoading,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overlay-background"
      onClick={(e) => handleOverlayClick(e)}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Grievance Details</h2>
          <button
            onClick={(e) => closeOverlay(e)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applicationNumber && (
            <div>
              <h3 className="font-semibold text-gray-700">
                Application Number
              </h3>
              <p>{applicationNumber}</p>
            </div>
          )}

          {name && (
            <div>
              <h3 className="font-semibold text-gray-700">Name</h3>
              <p>{name}</p>
            </div>
          )}

          {prn && (
            <div>
              <h3 className="font-semibold text-gray-700">PRN No.</h3>
              <p>{prn}</p>
            </div>
          )}

          {email && (
            <div>
              <h3 className="font-semibold text-gray-700">Email</h3>
              <p>{email}</p>
            </div>
          )}
          {department && (
            <div>
              <h3 className="font-semibold text-gray-700">Department</h3>
              <p>{department}</p>
            </div>
          )}
          {grievanceType && (
            <div>
              <h3 className="font-semibold text-gray-700">Grievance Type</h3>
              <p>{grievanceType}</p>
            </div>
          )}

          {resolved && (
            <div>
              <h3 className="font-semibold text-gray-700">Status</h3>
              <p
                className={`${
                  resolved === "true"
                    ? "text-green-500"
                    : resolved === "false"
                    ? "text-red-500"
                    : "text-yellow-500"
                }`}
              >
                {resolved === "true"
                  ? "Resolved"
                  : resolved === "false"
                  ? "Pending"
                  : "Under Review"}
              </p>
            </div>
          )}

          {createdAt && (
            <div>
              <h3 className="font-semibold text-gray-700">Created At</h3>
              <p>
                {(() => {
                  const date = new Date(createdAt);
                  return `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                  ).padStart(2, "0")}-${String(date.getDate()).padStart(
                    2,
                    "0"
                  )} ${String(date.getHours()).padStart(2, "0")}:${String(
                    date.getMinutes()
                  ).padStart(2, "0")}`;
                })()}
              </p>
            </div>
          )}

          {resolvedAt && (
            <div>
              <h3 className="font-semibold text-gray-700">Resolved At</h3>
              <p>
                {(() => {
                  const date = new Date(resolvedAt);
                  return `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                  ).padStart(2, "0")}-${String(date.getDate()).padStart(
                    2,
                    "0"
                  )} ${String(date.getHours()).padStart(2, "0")}:${String(
                    date.getMinutes()
                  ).padStart(2, "0")}`;
                })()}
              </p>
            </div>
          )}
        </div>

        {description && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-700">Description</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        )}

        {resolved !== "true" && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={grievanceResolve}
              className="bg-gray-200 text-green-600 px-4 py-2 rounded hover:bg-green-700 hover:text-white"
            >
              {loading ? "Resolving..." : "Resolve"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowGrievance;
