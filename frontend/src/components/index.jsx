import React from "react";
import HomeScreen from "./HomeScreen";
import VisionMission from "./VisionMission";
import AboutUs from "./AboutUs";
import MeetOurTeam from "./MeetOurTeam";
import ContactUs from "./ContactUs";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import GrievanceForm from "./GrievanceForm";
import Navbar from "./Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
                <VisionMission />
                <AboutUs />
                <MeetOurTeam />
                <ContactUs />
              </>
            }
          />
          <Route exact path="/grievanceform" element={<GrievanceForm />} />
          <Route exact path="/about" element={<AboutUs />} />
          <Route exact path="/contact" element={<ContactUs />} />
        </Routes>
      </Router>
    </div>
  );
};

export default index;
