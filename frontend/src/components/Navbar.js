import React, { useState } from "react";
import { IoMenu } from "react-icons/io5";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <nav className="bg-green-600 p-4 fixed top-0 left-0 w-full z-50 min-w-screen">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white hover:text-gray-300">
          <div className="text-white text-lg font-bold">GRIEVANCEBOX</div>
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-white hover:text-gray-300">
            Home
          </Link>
          <Link to="/grievanceform" className="text-white hover:text-gray-300">
            Add Grievance
          </Link>
          <Link to="/about" className="text-white hover:text-gray-300">
            About Us
          </Link>
          <Link to="/contact" className="text-white hover:text-gray-300">
            Contact Us
          </Link>
          
        </div>

        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            type="button"
            className="text-white focus:outline-none"
          >
            <IoMenu className="h-7 w-7" />
          </button>
        </div>
      </div>

      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:hidden bg-green-600 p-4 space-y-2`}
      >
        <Link to="/"  onClick={()=>setIsMenuOpen(false)} className="block text-white hover:bg-green-700 p-2">
          Home
        </Link>
        <Link
          to="/grievanceform" onClick={()=>setIsMenuOpen(false)}
          className="block text-white hover:bg-green-700 p-2"
        >
          Add Grievance
        </Link>
        <Link to="/about" onClick={()=>setIsMenuOpen(false)} className="block text-white hover:bg-green-700 p-2">
          About Us
        </Link>
        <Link to="/contact" onClick={()=>setIsMenuOpen(false)} className="block text-white hover:bg-green-700 p-2">
          Contact Us
        </Link>
        
      </div>
    </nav>
  );
};

export default Navbar;
