import React from "react";
import Logo from "@/assets/logo/lineLogo.svg";
import { useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const handleClick = (url) => {
    window.open(url, "_blank");
  }

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };
  return (
    <div className="w-full bg-white">
      <footer className="p-4 bg-white sm:p-6 dark:bg-gray-900 max-w-[1300px] mx-auto ">
        <div>
          <img src={Logo} alt="Logo" className="h-12 mb-4 mx-auto sm:mx-0" />
          <div className="flex flex-col sm:flex-row justify-between items-center p-2">
            <div className="text-gray-500 font-medium flex gap-6">
              <span onClick={() => handleNavigate('/')} className="hover:text-emerald-600 cursor-pointer">Home</span>
              <span onClick={() => handleNavigate('/events')} className="hover:text-emerald-600 cursor-pointer">Events</span>
              <span onClick={() => handleNavigate('/reports')} className="hover:text-emerald-600 cursor-pointer">Reports</span>
            </div>
            <div className="text-gray-400 flex gap-4 mt-2">
              <span onClick={() => handleClick('https://www.instagram.com/')} className="hover:text-emerald-600 cursor-pointer">Instagram</span>
              <span onClick={() => handleClick('https://x.com/')} className="hover:text-emerald-600 cursor-pointer">X(Twitter)</span>
              <span onClick={() => handleClick('https://www.linkedin.com/')} className="hover:text-emerald-600 cursor-pointer">LinkedIn</span>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="flex items-center justify-center text-center">
          <p className="text-gray-400 font-medium ">
            Crafted by{" "}
            <a
              href="https://zamil.vercel.app/"
              className="hover:underline font-semibold text-[#1D7E53]"
            >
              Shamil
            </a>{" "}
            &{" "}
            <a
              href="https://www.instagram.com/dayyan._ali/"
              className="hover:underline font-semibold  text-[#1D7E53]"
            >
              Dayyan Ali
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
