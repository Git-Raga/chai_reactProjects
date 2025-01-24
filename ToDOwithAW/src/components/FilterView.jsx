import React, { useEffect, useState } from "react";
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

function FilterView({ theme, selectedFont, setSelectedFont,filterOption, setFilterOption }) {
 

  useEffect(() => {
    const storedFont = localStorage.getItem('selectedFont');
    const storedFilter = localStorage.getItem('filterOption'); 
     
    if (storedFont && fonts[storedFont]) {
      setSelectedFont(fonts[storedFont]);
    }

    if (storedFilter) {
      setFilterOption(storedFilter);
    }

   
    
  }, [setSelectedFont,setFilterOption]);


  
  


  const handleFontChange = (font) => {
    setSelectedFont(font);
    localStorage.setItem('selectedFont', Object.keys(fonts).find(key => fonts[key] === font));
  };

  const handleFilterChange = (option) => {
    setFilterOption(option);
    localStorage.setItem('filterOption', option);
  };

  const iconColor = getIconColor(theme);

  return (
   
      <div className="flex space-x-4 mb-4">
       

      {/* Filter Options */}
      <div className="mt-4">
        <div className={'flex items-center space-x-4'}>
        <label className="flex items-center space-x-2">
  <input
    type="radio"
    name="filter"
    value="All"
    checked={filterOption === "All"}
    onChange={() => handleFilterChange("All")}
    className="focus:ring-2 focus:ring-blue-300"
  />
  <span className={`text-sm ${filterOption === "All" ? "border-b-2 border-blue-500" : ""}`}>All</span>
</label>
<label className="flex items-center space-x-2">
  <input
    type="radio"
    name="filter"
    value="Active"
    checked={filterOption === "Active"}
    onChange={() => handleFilterChange("Active")}
    className="focus:ring-2 focus:ring-blue-300"
  />
  <span className={`text-sm ${filterOption === "Active" ? "border-b-2 border-blue-500" : ""}`}>Active</span>
</label>
            
        </div>
      </div>
    </div>
  );
}

export default FilterView;
