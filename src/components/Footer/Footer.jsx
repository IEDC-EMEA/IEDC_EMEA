import React from "react";
import Logo from "@/assets/logo/lineLogo.svg";

function Footer() {
  return (
    <div className="w-full bg-white">
      <footer className="p-4 bg-white sm:p-6 dark:bg-gray-900 max-w-[1300px] mx-auto  mt-10">
        <div>
          <img src={Logo} alt="Logo" className="h-12 mb-4 mx-auto sm:mx-0" />
          <div className="flex flex-col sm:flex-row justify-between items-center p-2">
            <div className="text-gray-500 font-medium flex gap-6">
              <span>Home</span> <span>Features</span> <span>Contact</span>
            </div>
            <div className="text-gray-400 flex gap-4 mt-2">
              <span>Instagram</span>
              <span>X(Twitter)</span>
              <span>LinkedIn</span>
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
