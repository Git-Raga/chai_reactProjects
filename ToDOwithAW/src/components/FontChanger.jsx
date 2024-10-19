import React, { useEffect } from "react";
import { FaFont } from 'react-icons/fa'; // Using react-icons for simplicity

// Define three different custom font families
const fonts = {
  titillium: "font-titillium",
  lato: "font-lato",
  ubuntu: "font-ubuntu",
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
  
  // Retrieve the font from local storage when the component mounts
  useEffect(() => {
    const storedFont = localStorage.getItem('selectedFont');
    if (storedFont && fonts[storedFont]) {
      setSelectedFont(fonts[storedFont]);
    }
  }, [setSelectedFont]);

  // Handle font change
  const handleFontChange = (font) => {
    setSelectedFont(font);
    localStorage.setItem('selectedFont', Object.keys(fonts).find(key => fonts[key] === font));
  };

  // Determine the icon color based on the theme
  const iconColor = getIconColor(theme);

  return (
    <div className="p-5">
      <div className="flex space-x-4 mb-4">
        {/* Icon for Titillium */}
        <button onClick={() => handleFontChange(fonts.titillium)} className="focus:outline-none flex flex-col items-center">
          <span className={`${iconColor} ${selectedFont === fonts.titillium ? 'font-bold' : ''} text-sm`}>ⓕ</span>
          {selectedFont === fonts.titillium && <span className="w-full h-1 mt-1 bg-blue-200"></span>}
        </button>

        {/* Icon for Lato */}
        <button onClick={() => handleFontChange(fonts.lato)} className="focus:outline-none flex flex-col items-center">
          <span className={`${iconColor} ${selectedFont === fonts.lato ? 'font-bold' : ''} text-sm`}>f</span>
          {selectedFont === fonts.lato && <span className="w-full h-1 mt-1 bg-blue-200"></span>}
        </button>

        {/* Icon for Ubuntu */}
        <button onClick={() => handleFontChange(fonts.ubuntu)} className="focus:outline-none flex flex-col items-center">
          <span className={`${iconColor} ${selectedFont === fonts.ubuntu ? 'font-bold' : ''} text-sm`}>🇫</span>
          {selectedFont === fonts.ubuntu && <span className="w-full h-1 mt-1 bg-blue-200"></span>}
        </button>
      </div>
    </div>
  );
}

export default FontChanger;
