import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }
    if (username === "admin.dypsn" && password === "admin@dypsn") {
      navigate("/dash");
    } else {
      alert("Invalid credentials");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md sm:max-w-lg lg:max-w-xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
          Admin Sign In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="block text-gray-700 text-base sm:text-lg lg:text-xl font-medium mb-2">
              Admin Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
          <div className="form-group">
            <label className="block text-gray-700 text-base sm:text-lg lg:text-xl font-medium mb-2">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!username || !password}
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-base sm:text-lg lg:text-xl"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
