import React from "react";
import HomeScreen from "./HomeScreen";
import AboutUs from "./AboutUs";
import MeetOurTeam from "./MeetOurTeam";
import ContactUs from "./ContactUs";
import GrievanceForm from "./GrievanceForm";
import Navbar from "./Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GrievanceList from "./GrievanceList.js";
import Dashboard from "./dashboard.js";
import CheckGreivance from "./CheckGreivance.js";
import GrievanceDetails from "./GrievanceDetails.js";
import LoginForm from "./LoginForm.js";

const index = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route
            exact
            path="/"
            element={
              <>
                <HomeScreen />
                <MeetOurTeam />
                <ContactUs />
              </>
            }
          />
          <Route exact path="/grievanceform" element={<GrievanceForm />} />
          <Route exact path="/about" element={<AboutUs />} />
          <Route exact path="/contact" element={<ContactUs />} />
          <Route exact path="/gr-list" element={<GrievanceList />} />
          <Route exact path="/dash" element={<Dashboard />} />
          <Route exact path="/check-status" element={<CheckGreivance />} />
          <Route exact path="/details" element={<GrievanceDetails />} />
          <Route exact path="/login" element={<LoginForm />} />
        </Routes>
      </Router>
    </div>
  );
};

export default index;
