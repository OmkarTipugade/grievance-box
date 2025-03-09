import React, { useEffect } from "react";
import { FaEye, FaBullseye } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const VisionMission = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-green-700 text-white">
      <h1 className="text-4xl font-bold text-gray-200 mb-4 mt-10 text-center">
        Our Vision & Mission
      </h1>
      <p className="text-xl text-gray-300 text-center px-4">
        Committed to excellence and innovation in grievance management.
      </p>

      <div
        id="vm"
        className="flex flex-col lg:flex-row items-center justify-center w-full p-4 lg:p-10"
      >
        {/* Vision Section */}
        <section
          className="flex flex-col lg:flex-row items-center justify-center w-full my-5 lg:my-10 lg:w-4/5"
          data-aos="fade-right"
        >
          <div className="flex items-center p-5">
            <div className="mr-5 text-gray-100">
              <FaEye size={40} />
            </div>
            <div>
              <h2 className="text-3xl text-gray-100 mb-2 font-bold">
                Our Vision
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed text-justify">
                Our vision is to become a globally recognized platform that
                helps individuals address their grievances seamlessly, fostering
                a world where communication and problem resolution are
                efficient, transparent, and respectful. By providing this
                platform, we aim to enhance transparency, accountability, and
                communication between students and the institution.
              </p>
            </div>
          </div>
        </section>

        <img
          src={require("../images/group.png")}
          className="w-full h-auto lg:w-[800px] lg:h-[400px] my-5 lg:my-0"
          alt="Group"
        />

        {/* Mission Section */}
        <section
          className="flex flex-col lg:flex-row-reverse items-center justify-center w-full my-5 lg:my-10 lg:w-4/5"
          data-aos="fade-left"
        >
          <div className="flex items-center px-6 flex-row-reverse">
            <div className="ml-0 lg:ml-5 text-gray-100">
              <FaBullseye size={40} />
            </div>
            <div>
              <h2 className="text-3xl text-gray-100 mb-2 font-bold">
                Our Mission
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed text-justify">
                Our mission is to provide a robust, user-friendly grievance
                management system that empowers users to voice their concerns
                with confidence, ensuring fair and prompt resolutions while
                maintaining the highest standards of service and support.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VisionMission;
