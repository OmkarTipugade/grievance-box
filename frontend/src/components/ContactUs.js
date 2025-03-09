import React from "react";
import { CgWebsite } from "react-icons/cg";
import { MdOutlineEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaSquarePhone } from "react-icons/fa6";

const ContactUs = () => {
  return (
    <div className="flex flex-col md:flex-row justify-around bg-green-800 text-white p-5">
      <div className="flex items-center justify-center mb-5 md:mb-0">
        <h1 className="font-bold text-3xl">CONTACT US</h1>
      </div>
      <div>
        <p className="my-2 font-bold text-xl">GRIEVANCE BOX</p>
        <div className="flex flex-row text-xl items-center mb-2">
          <FaSquarePhone className="mr-2" />
          <p>0231 232 0914</p>
        </div>
        <a href="mailto:dype472.ec@unishivaji.ac.in">
          <div className="flex flex-row text-xl items-center mb-2">
            <MdOutlineEmail className="mr-2" />
            <p>dype472.ec@unishivaji.ac.in</p>
          </div>
        </a>
        <a
          href="https://coes.dypgroup.edu.in"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex flex-row text-xl items-center mb-2">
            <CgWebsite className="mr-2" />
            <p>https://coes.dypgroup.edu.in</p>
          </div>
        </a>
        <div className="flex flex-row text-xl items-center">
          <FaLocationDot className="mr-2" />
          <p>
            R. S. No. 865 A-Ward, Salokhe Nagar, Kolhapur, Maharashtra 416001
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
