import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "../context/AuthContext";

// Lazy load components
const HomeScreen = lazy(() => import("./HomeScreen"));
const AboutUs = lazy(() => import("./AboutUs"));
const ContactUs = lazy(() => import("./ContactUs"));
const GrievanceForm = lazy(() => import("./GrievanceForm"));
const GrievanceList = lazy(() => import("./GrievanceList.js"));
const Dashboard = lazy(() => import("./dashboard.js"));
const CheckGreivance = lazy(() => import("./CheckGreivance.js"));
const GrievanceDetails = lazy(() => import("./GrievanceDetails.js"));
const LoginForm = lazy(() => import("./LoginForm.js"));
const GrievanceDetailsDash = lazy(() => import("./GrievanceDetailsDash.js"));

// Loading component for suspense fallback
const RouteLoading = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-green-50 pt-16">
    <div className="text-green-600 text-xl font-semibold">Loading...</div>
  </div>
);

const Index = () => {
  return (
    <AuthProvider>
      <div>
        <Router>
          <Navbar />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route
                exact
                path="/"
                element={
                  <>
                    <HomeScreen />
                    <ContactUs />
                  </>
                }
              />
              <Route exact path="/grievanceform" element={<GrievanceForm />} />
              <Route exact path="/about" element={<AboutUs />} />
              <Route exact path="/contact" element={<ContactUs />} />
              <Route exact path="/gr-list" element={<GrievanceList />} />
              <Route
                exact
                path="/dash"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route exact path="/check-status" element={<CheckGreivance />} />
              <Route exact path="/details" element={<GrievanceDetails />} />
              <Route exact path="/login" element={<LoginForm />} />
              <Route
                exact
                path="/dash-details"
                element={
                  <ProtectedRoute>
                    <GrievanceDetailsDash />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </Router>
      </div>
    </AuthProvider>
  );
};

export default Index;
