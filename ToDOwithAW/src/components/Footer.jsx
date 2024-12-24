import React, { useState } from "react";
import { FcSupport } from "react-icons/fc"; // Import a support icon for Tech Support
import { FaDove } from "react-icons/fa";

function Footer({ theme }) {

  // Dummy function for the onClick event
  const handleTechSupportClick = (e) => {
    console.log("Tech Support clicked");
  };

  const footerbgcolor = {
    light: "bg-gray-600 text-white bg-opacity-100", // Ensure non-transparent background
    dark: "bg-white text-black bg-opacity-100", // Ensure non-transparent background
    green: "bg-green-50 text-black bg-opacity-100", // Ensure non-transparent background
  };

  return (
    <footer className={`
    w-full
    fixed bottom-0 ${footerbgcolor[theme]} `}>
      {/* Apply theme-based background and TEKO font */}
      <div className="container mx-auto flex justify-center items-center border-t border-dotted font-mono border-gray-400">
        {/* Left Section: Copyright */}
        <div className="text-base mr-auto flex items-center
        font-titillium">
          <span>&copy; {new Date().getFullYear()}</span>
          
          <span>FreeMindWorks...</span>
          <span className="mx-1"><FaDove /></span> {/* Dove icon with a margin */}
        </div>

        {/* Center Section: TechSupport */}
        <div
          className="flex items-center space-x-2 p-1 cursor-pointer
          font-titillium"
          onClick={handleTechSupportClick} // OnClick function
        >
          <FcSupport className="text-white" /> {/* Support Icon */}
          <span className="text-sm font-bold">Support</span>
        </div>

        {/* Right Section: Version */}
        <div className="text-sm ml-auto font-titillium">
          Ver | 1.0
        </div>
      </div>
    </footer>
  );
}

export default Footer;
