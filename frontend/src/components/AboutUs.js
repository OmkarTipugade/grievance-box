import React from "react";
import group from "../images/group.jpeg";

const AboutUs = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-5 sm:p-10 mt-10">
      <p className="font-bold text-3xl items-center lg:text-4xl text-center lg:text-left">
        ABOUT US
      </p>
      <div className="flex flex-col lg:flex-row justify-around items-center w-full">
        <div className="lg:w-1/2 w-full text-justify">
          <div
            className="text-base sm:text-lg lg:text-xl mt-10 lg:mt-15 py-5 sm:py-10 px-5 lg:px-20 xl:px-40 bg-green-700 text-white rounded-xl
          "
          >
            <p className="mb-6">
              At GravienceBox, we are committed to empowering students by
              providing a platform where their voices are not only heard but
              actively addressed. We understand that students often face
              challenges that need resolution, and our Student Grievance System
              is designed to make this process as smooth and effective as
              possible. Our goal is to ensure that student concerns are managed
              in a transparent, efficient, and fair manner.
            </p>
            <p className="mb-6">
              Our motive is to create a safe, supportive, and inclusive space
              where students can raise their issues without hesitation. We
              believe that every concern, no matter how big or small, deserves
              attention. Whether it's a complaint about campus facilities,
              academic concerns, or interpersonal conflicts, GravienceBox
              ensures a structured process to resolve these grievances with
              efficiency and integrity.
            </p>
            <p className="mb-6">
              We take pride in providing a <strong>user-friendly</strong>{" "}
              platform that allows students to easily submit their concerns and
              monitor the status of their cases in real-time. Our system keeps
              students informed at every stage, offering clear timelines and
              updates on progress.
            </p>
          </div>
        </div>
        <div className="mt-10 lg:mt-0 lg:w-1/2 w-full flex justify-center">
          <img
            src={group}
            className="w-64 sm:w-96 lg:w-full max-w-lg"
            alt="group"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
