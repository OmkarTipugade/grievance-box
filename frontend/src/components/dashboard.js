import { useEffect, useState } from "react";
import axios from "axios";
import ShowGrievance from "./ShowGrievance";

const Dashboard = () => {
  const [grievances, setGrievances] = useState([]);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [loading, setLoading] = useState(false);
  // Filter states
  const [filterType, setFilterType] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  // Date filter states
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterDay, setFilterDay] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/all-grievances");
      setGrievances(response.data);
    } catch (error) {
      console.error("Error fetching grievance data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRowClick = async (grievance) => {
    setShowOverlay(true);

    try {
      if (grievance.resolved === "true") {
        setSelectedGrievance(grievance);
        return;
      }

      const response = await axios.patch(
        `http://localhost:5000/grievance/${grievance.applicationNumber}/scrutiny`
      );
      setSelectedGrievance(response.data.grievance);
      fetchData();
    } catch (error) {
      console.error("Error handling row click:", error);
    }
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setSelectedGrievance(null);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("overlay-background")) {
      closeOverlay();
    }
  };

  const grievanceResolve = async () => {
    if (!selectedGrievance) return;
    setLoading(true);
    try {
      const response = await axios.patch(
        `http://localhost:5000/grievance/${selectedGrievance.applicationNumber}/resolve`
      );
      setSelectedGrievance(response.data.grievance);
      fetchData();
    } catch (error) {
      console.error("Error resolving grievance:", error);
    }
    setLoading(false);
  };

  // Generate available years, months, and days from grievances
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // Filtered grievances
  const filteredGrievances = grievances.filter((g) => {
    const date = new Date(g.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    const day = date.getDate();

    const matchType = !filterType || g.grievanceType === filterType;
    const matchDept = !filterDepartment || g.department === filterDepartment;
    const matchStatus = !filterStatus || g.resolved === filterStatus;
    const matchYear = !filterYear || year === parseInt(filterYear);
    const matchMonth = !filterMonth || month === parseInt(filterMonth);
    const matchDay = !filterDay || day === parseInt(filterDay);

    return (
      matchType &&
      matchDept &&
      matchStatus &&
      matchYear &&
      matchMonth &&
      matchDay
    );
  });

  // Extract unique options for dropdowns
  const grievanceTypes = [
    "academic",
    "administrative",
    "hostel",
    "disciplinary",
    "other",
  ];

  const departments = [
    "first year",
    "computer science eng.",
    "civil eng.",
    "electrical eng.",
    "data science eng.",
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-5 mt-14">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3>Total Grievances</h3>
            <p className="text-2xl font-bold">{grievances.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3>Pending</h3>
            <p className="text-2xl font-bold text-red-500">
              {grievances.filter((g) => g.resolved === "false").length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3>Resolved</h3>
            <p className="text-2xl font-bold text-green-500">
              {grievances.filter((g) => g.resolved === "true").length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3>Under Review</h3>
            <p className="text-2xl font-bold text-yellow-500">
              {grievances.filter((g) => g.resolved === "scrutiny").length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h3 className="text-lg font-medium mb-3">Filters</h3>
          <div className="flex flex-wrap gap-4">
            {/* Existing filters */}
            <select
              className="border px-3 py-2 rounded"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              {grievanceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              className="border px-3 py-2 rounded"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              className="border px-3 py-2 rounded"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="false">Pending</option>
              <option value="scrutiny">Under Review</option>
              <option value="true">Resolved</option>
            </select>

            {/* Date filters */}
            <input
              className="border px-3 py-2 rounded"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              type="number"
              placeholder="Year"
              min={2000}
              max={new Date().getFullYear()}
            />

            <select
              className="border px-3 py-2 rounded"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            >
              <option value="">All Months</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>

            <input
              className="border px-3 py-2 rounded"
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value)}
              type="number"
              placeholder="Day"
              min={1}
              max={31}
            />
          </div>

          {/* Reset filters button */}
          <button
            className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            onClick={() => {
              setFilterType("");
              setFilterDepartment("");
              setFilterStatus("");
              setFilterYear("");
              setFilterMonth("");
              setFilterDay("");
            }}
          >
            Reset Filters
          </button>
        </div>

        {/* Grievance Table */}
        <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
          <h3 className="text-lg font-medium mb-3">Recent Grievances</h3>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Department</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrievances.map((g) => (
                <tr
                  className="border-b hover:bg-gray-100 cursor-pointer"
                  key={g.applicationNumber}
                  onClick={() => handleRowClick(g)}
                >
                  <td className="px-4 py-2">{g.applicationNumber}</td>
                  <td className="px-4 py-2">{g.department || ""}</td>
                  <td className="px-4 py-2">{g.grievanceType}</td>
                  <td
                    className={`px-4 py-2 ${
                      g.resolved === "true"
                        ? "text-green-500"
                        : g.resolved === "false"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {g.resolved === "true"
                      ? "Resolved"
                      : g.resolved === "false"
                      ? "Pending"
                      : "Under Review"}
                  </td>
                  <td className="px-4 py-2">
                    {(() => {
                      const date = new Date(g.createdAt);
                      return `${date.getFullYear()}-${String(
                        date.getMonth() + 1
                      ).padStart(2, "0")}-${String(date.getDate()).padStart(
                        2,
                        "0"
                      )} ${String(date.getHours()).padStart(2, "0")}:${String(
                        date.getMinutes()
                      ).padStart(2, "0")}`;
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Overlay */}
        {showOverlay && selectedGrievance && (
          <ShowGrievance
            handleOverlayClick={handleOverlayClick}
            closeOverlay={closeOverlay}
            applicationNumber={selectedGrievance.applicationNumber}
            department={selectedGrievance.department}
            grievanceType={selectedGrievance.grievanceType}
            resolved={selectedGrievance.resolved}
            createdAt={selectedGrievance.createdAt}
            grievanceResolve={grievanceResolve}
            name={selectedGrievance.name}
            prn={selectedGrievance.prn}
            email={selectedGrievance.email}
            description={selectedGrievance.description}
            resolvedAt={selectedGrievance.resolvedAt}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
