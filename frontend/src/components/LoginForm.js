import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, error, clearError, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dash");
    }
  }, [isAuthenticated, navigate]);

  // Clear error message when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    login(username, password)
      .then(() => {
        navigate("/dash");
      })
      .catch((err) => {
        console.error("Login failed:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md sm:max-w-lg lg:max-w-xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
          Admin Sign In
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="block text-gray-700 text-base sm:text-lg lg:text-xl font-medium mb-2">
              Admin Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              disabled={isLoading}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={!username || !password || isLoading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-base sm:text-lg lg:text-xl disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
