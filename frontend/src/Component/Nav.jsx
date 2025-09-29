import React, { useState } from 'react';
import { FaBars, FaXmark } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Desktop Navigation */}
        <div className="flex justify-between py-4 items-center">
          {/* Logo */}
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI ProductivityPro
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to={"/"} className="text-gray-700 hover:text-indigo-600 font-medium transition-all duration-200 hover:-translate-y-0.5">
              Home
            </Link>
            <Link to={"/"}  className="text-gray-700 hover:text-indigo-600 font-medium transition-all duration-200 hover:-translate-y-0.5">
              About
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium transition-all duration-200 hover:-translate-y-0.5">
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 p-2"
            >
              {isMenuOpen ? <FaXmark size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <a href="#home" className="text-gray-700 hover:text-indigo-600 font-medium px-2 py-2">
                Home
              </a>
              <a href="#about" className="text-gray-700 hover:text-indigo-600 font-medium px-2 py-2">
                About
              </a>
              <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium px-2 py-2">
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
