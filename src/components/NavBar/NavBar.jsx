import React, { useState } from "react";
import logo from "@/assets/logo/lineLogo.svg";
import { HashLink } from "react-router-hash-link";
import { NavLink, useLocation } from "react-router-dom";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", to: "/", type: "route" },
    { name: "About", to: "/#about", type: "hash" },
    { name: "Activities", to: "/events", type: "route" },
    { name: "Reports", to: "/reports", type: "route" },
    { name: "EMEA", to: "https://www.emeacollege.ac.in/", type: "external" },
  ];

  const isHashActive = (to) => {
    return location.pathname + location.hash === to;
  };

  return (
    <div className="fixed w-full top-10 z-50 px-3 sm:px-6 md:px-8">
      <nav className="bg-white/50 backdrop-blur-xl shadow-md border border-gray-200 px-4 sm:px-6 lg:px-8 py-2.5 rounded-full max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <NavLink to="/" className="flex items-center">
            <img
              src={logo}
              className="h-10 sm:h-12 md:h-14 w-auto"
              alt="IEDC EMEA Logo"
            />
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item, index) => {
              if (item.type === "external") {
                return (
                  <a
                    key={index}
                    href={item.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200 px-2 py-1"
                  >
                    {item.name}
                  </a>
                );
              }

              if (item.type === "hash") {
                return (
                  <HashLink
                    key={index}
                    smooth
                    to={item.to}
                    className={`font-medium transition-colors duration-200 px-2 py-1 ${
                      isHashActive(item.to)
                        ? "text-emerald-600"
                        : "text-gray-700 hover:text-emerald-600"
                    }`}
                  >
                    {item.name}
                  </HashLink>
                );
              }

              return (
                <NavLink
                  key={index}
                  to={item.to}
                  className={({ isActive }) =>
                    `font-medium transition-colors duration-200 px-2 py-1 ${
                      isActive
                        ? "text-emerald-600"
                        : "text-gray-700 hover:text-emerald-600"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6"
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

        {/* Mobile Dropdown */}
        <div
          className={`absolute top-16 right-4 z-50 w-40 bg-white text-black rounded-lg shadow-lg flex flex-col p-4 transition-all duration-300 ${
            isMenuOpen
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0 pointer-events-none"
          }`}
        >
          {navItems.map((item, index) => {
            if (item.type === "external") {
              return (
                <a
                  key={index}
                  href={item.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 text-center hover:text-emerald-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              );
            }

            if (item.type === "hash") {
              return (
                <HashLink
                  key={index}
                  smooth
                  to={item.to}
                  className={`py-2 text-center ${
                    isHashActive(item.to)
                      ? "text-emerald-600"
                      : "text-gray-800 hover:text-emerald-500"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </HashLink>
              );
            }

            return (
              <NavLink
                key={index}
                to={item.to}
                className={({ isActive }) =>
                  `py-2 text-center ${
                    isActive
                      ? "text-emerald-600"
                      : "text-gray-800 hover:text-emerald-500"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default NavBar;