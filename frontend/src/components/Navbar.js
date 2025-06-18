import React, { useState, useCallback, memo } from "react";
import { IoMenu, IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

const NavLink = memo(({ to, children }) => (
  <Link
    to={to}
    className="text-white hover:text-gray-300 transition duration-200"
  >
    {children}
  </Link>
));

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prevState) => !prevState);
  }, []);

  return (
    <nav className="bg-green-600 p-4 fixed top-0 left-0 w-full z-50 min-w-screen shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-white hover:text-gray-300 transition duration-200"
        >
          <div className="text-white text-lg font-bold">GRIEVANCEBOX</div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/login">Dashboard</NavLink>
          <NavLink to="/grievanceform">Add Grievance</NavLink>
          <NavLink to="/check-status">Check Grievance</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/contact">Contact Us</NavLink>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            type="button"
            className="text-white focus:outline-none"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <IoClose className="h-7 w-7" />
            ) : (
              <IoMenu className="h-7 w-7" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-green-700 mt-2 px-4 py-3 shadow-lg">
          <div className="flex flex-col space-y-3">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/login">Dashboard</NavLink>
            <NavLink to="/grievanceform">Add Grievance</NavLink>
            <NavLink to="/check-status">Check Grievance</NavLink>
            <NavLink to="/about">About Us</NavLink>
            <NavLink to="/contact">Contact Us</NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default memo(Navbar);
