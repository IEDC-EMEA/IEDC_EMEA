import React, { useState } from "react";
import logo from "@/assets/logo/lineLogo.svg";
import { HashLink as Link } from "react-router-hash-link";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { name: "Home", to: "/" },
    { name: "About", to: "/#about" },
    { name: "Activities", to: "events" },
    { name: "Reports", to: "reports" },
    { name: "EMEA", to: "https://www.emeacollege.ac.in/" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed w-full top-10 z-50 px-3 sm:px-6 md:px-8">
      <nav className="bg-white shadow-md border border-gray-200 px-4 sm:px-6 lg:px-8 py-2.5 rounded-full max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="#" className="flex items-center" onClick={closeMenu}>
            <img 
              src={logo} 
              className="h-10 sm:h-12 md:h-14 w-auto" 
              alt="IEDC EMEA Logo" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item, index) => (
              item.to.startsWith("http") ? (
                <a
                  key={index}
                  href={item.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 px-2 py-1"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={index}
                  smooth
                  to={item.to}
                  className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 px-2 py-1"
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            type="button"
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div 
          className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden mt-4 transition-all duration-300 ease-in-out`}
          id="mobile-menu"
        >
          <div className="py-3 space-y-1 border-t border-gray-200">
            {navItems.map((item, index) => (
              <div key={index} className="px-2">
                {item.to.startsWith("http") ? (
                  <a
                    href={item.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
                    onClick={closeMenu}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    smooth
                    to={item.to}
                    className="block px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
                    onClick={closeMenu}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;