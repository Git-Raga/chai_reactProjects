import React, { useEffect } from "react";
import { FaFont } from 'react-icons/fa'; 

// Define custom font families
const fonts = {
  titillium: "font-titillium",
  bonaNovaSC: "font-bonaNovaSC uppercase", // Ensure uppercase is applied
  poppins: "font-poppins", // Updated to Poppins
};

// Define colors for the icons based on the theme
const getIconColor = (theme) => {
  switch (theme) {
    case 'light':
      return 'text-black';
    case 'dark':
      return 'text-white';
    case 'green':
      return 'text-green-200';
    default:
      return 'text-black';
  }
};

function FontChanger({ theme, selectedFont, setSelectedFont }) {
  
  useEffect(() => {
    const storedFont = localStorage.getItem('selectedFont');
    if (storedFont && fonts[storedFont]) {
      setSelectedFont(fonts[storedFont]);
    }
  }, [setSelectedFont]);

  const handleFontChange = (font) => {
    setSelectedFont(font);
    localStorage.setItem('selectedFont', Object.keys(fonts).find(key => fonts[key] === font));
  };

  const iconColor = getIconColor(theme);

  return (
    <div className="p-5">
      <div className="flex space-x-4 mb-4">
        {/* Icon for Titillium */}
        <button onClick={() => handleFontChange(fonts.titillium)} className="focus:outline-none flex flex-col items-center">
          <span className={`${iconColor} ${selectedFont === fonts.titillium ? 'font-bold' : ''} text-sm`}>ⓕ</span>
          {selectedFont === fonts.titillium && <span className="w-full h-1 mt-1 bg-blue-200"></span>}
        </button>

        {/* Icon for Bona Nova SC with uppercase */}
        <button onClick={() => handleFontChange(fonts.bonaNovaSC)} className="focus:outline-none flex flex-col items-center">
          <span className={`${iconColor} ${selectedFont === fonts.bonaNovaSC ? 'font-bold uppercase' : ''} text-sm`}>🇫</span>
          {selectedFont === fonts.bonaNovaSC && <span className="w-full h-1 mt-1 bg-blue-200"></span>}
        </button>

        {/* Icon for Poppins */}
        <button onClick={() => handleFontChange(fonts.poppins)} className="focus:outline-none flex flex-col items-center">
          <span className={`${iconColor} ${selectedFont === fonts.poppins ? '' : ''} text-sm`}>f</span> {/* Removed font-bold */}
          {selectedFont === fonts.poppins && <span className="w-full h-1 mt-1 bg-blue-200"></span>}
        </button>
      </div>
    </div>
  );
}

export default FontChanger;
