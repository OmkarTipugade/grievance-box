import React from "react";
import TeamMember from "./TeamMember";
import omkar from "../images/omkar-pro.jpeg";
import ritesh from "../images/ritesh-pro.jpeg";
import akanksha from "../images/akanksha-pro.jpeg";
import saloni from "../images/saloni-pro.png";
import rutuja from "../images/rutuja-pro.jpeg";

const MeetOurTeam = () => {
  return (
    <div className="bg-white text-black p-3">
      <h1 className="text-4xl font-bold text-center">Meet our team</h1>
      <p className="text-gray-500 mt-4 text-xl text-center">
        We're a dynamic group of individuals who are passionate about what we
        do.
      </p>
      <div className="flex flex-col md:flex-row justify-center items-center md:gap-8 mt-12 space-y-8 md:space-y-0 px-4">
        <TeamMember
          name="Akanksha Powar "
          role="Fronted Developer"
          link="https://www.linkedin.com/in/akanksha-powar-533686276/"
          imgUrl={akanksha}
        />
        <TeamMember
          name="Ritesh Shinde"
          role="Fronted Developer"
          link="https://www.linkedin.com/in/ritesh-shinde-051489268/"
          imgUrl={ritesh}
        />
        <TeamMember
          name="Omkar Tipugade"
          role="Fronted Developer"
          link="https://www.linkedin.com/in/omkar-tipugade/"
          imgUrl={omkar}
        />
        <TeamMember
          name="Rutuja Rajigare"
          role="Backend Developer, Database"
          link="https://www.linkedin.com/in/rutuja-rajigare-66313a276/"
          imgUrl={rutuja}
        />
        <TeamMember
          name="Saloni Patil"
          role="Backend Developer, API"
          link="https://www.linkedin.com/in/saloni-patil07/"
          imgUrl={saloni}
        />
      </div>
    </div>
  );
};

export default MeetOurTeam;
