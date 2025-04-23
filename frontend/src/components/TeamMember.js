import React from "react";
import { FaLinkedin } from "react-icons/fa";

const TeamMember = (props) => {
  return (
    <div className="bg-green-800 rounded-lg shadow-lg p-6 w-full md:w-72">
      <img
        className="rounded-full w-44 h-44 mx-auto mb-4"
        src={props.imgUrl}
        alt={props.name}
      />
      <h2 className="text-center text-xl font-semibold text-white">
        {props.name}
      </h2>
      <p className="text-center text-gray-400">{props.role}</p>
      <div className="flex justify-center mt-4 space-x-4 text-xl">
        <a href={props.link} className="text-blue-500">
          <FaLinkedin />
        </a>
      </div>
    </div>
  );
};

export default TeamMember;
