import React from "react";
import home from "../videos/home.mp4";
import Navbar from "./Navbar";

const HomeScreen = () => {
  return (
    <div>
      <Navbar />
      <div className="relative h-screen w-full">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={home}
          autoPlay
          loop
          muted
        ></video>

        {/* Overlay Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-center">
            Welcome to Grievance Box
          </h1>
          <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl text-center px-4 sm:px-6 md:px-10">
            Your voice matters, let us help you resolve issues.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
