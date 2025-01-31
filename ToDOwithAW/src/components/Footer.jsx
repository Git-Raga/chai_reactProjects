import React, { useState } from "react";
import { FcSupport } from "react-icons/fc";
import { FaDove } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function Footer({ theme }) {
  const navigate = useNavigate();

  const handleTechSupportClick = () => {
    navigate('/support');
  };

  const [isDoveHovered, setIsDoveHovered] = useState(false);

  const footerbgcolor = {
    light: "bg-gray-400 text-white bg-opacity-100",
    dark: "bg-white text-black bg-opacity-100",
    green: "bg-green-50 text-black bg-opacity-100",
  };

  return (
    <footer className={`
    w-full
    fixed bottom-0 ${footerbgcolor[theme]} `}>
      <div className="container mx-auto flex justify-center items-center border-t border-dotted font-mono border-gray-400">
        <div className="text-base mr-auto flex items-center font-titillium">
          <span>&copy; {new Date().getFullYear()}</span>
          <span>FreeMindWorks...</span>
          <span
            className={`mx-1 cursor-pointer ${
              isDoveHovered ? 'text-gray-800' : ''
            }`}
            onMouseEnter={() => setIsDoveHovered(true)}
            onMouseLeave={() => setIsDoveHovered(false)}
          >
            <FaDove />
            {isDoveHovered && (
              <span className="absolute bg-gray-800 text-white p-2 rounded-lg text-sm -mt-10 ml-2 whitespace-nowrap">
                Developed by Raghav... [using AI]
              </span>
            )}
          </span>
        </div>

        <div
          className="flex items-center space-x-2 p-1 cursor-pointer font-titillium"
          onClick={handleTechSupportClick}
        >
          <FcSupport className="text-white" />
          <span className="text-sm font-bold">Support</span>
        </div>

        <div className="text-sm ml-auto font-titillium">Ver | 1.0</div>
      </div>
    </footer>
  );
}

export default Footer;