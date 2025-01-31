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
const dropdownColors = {
    light: { bg: "bg-gray-100", text: "text-black", hover: "hover:bg-gray-200", selected: "bg-gray-300 text-black" },
    dark: { bg: "bg-gray-700", text: "text-white", hover: "hover:bg-gray-600", selected: "bg-gray-500 text-white" },
    green: { bg: "bg-cyan-700", text: "text-teal-100", hover: "hover:bg-teal-500", selected: "bg-teal-800 text-teal-100" },
  };

function FilterView({ theme, selectedFont, setSelectedFont,filterOption, setFilterOption,onOwnerChange }) {
    const [selectedOwner, setSelectedOwner] = useState("");


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


  useEffect(() => {
    const storedFont = localStorage.getItem('selectedFont');
    if (storedFont && fonts[storedFont]) {
      setSelectedFont(fonts[storedFont]);
    }
    // Set default to "Active"
    setFilterOption("Active");
  }, [setSelectedFont, setFilterOption]);

  const handleOwnerChange = (e) => {
    const owner = e.target.value;
    setSelectedOwner(owner);
    if (owner) {
      setFilterOption("All"); // Show all tasks when owner is selected
    }
    onOwnerChange(owner); // Pass selected owner to parent
  };


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
   
    <div className="flex items-center space-x-4 border border-gray-300 rounded-full px-4 py-2">
   <select 
        className={`text-xs p-1 rounded-md ${dropdownColors[theme].bg} ${dropdownColors[theme].text}`}
        onChange={handleOwnerChange}
        value={selectedOwner}
      >
   <option value="">All Users</option>
   <option value="Mahima">Mahima</option>
   <option value="Suresh">Suresh</option>
   <option value="Abhishek">Abhishek</option>
   <option value="Muskan">Muskan</option>
   <option value="Swetha">Swetha</option>
   <option value="Raghav M">Raghav M</option>
   <option value="Dileep">Dileep</option>
   <option value="Bhaskar">Bhaskar</option>
   <option value="Architha">Architha</option>
   <option value="Neha">Neha</option>
   <option value="Matt">Matt</option>
 </select>

 <div className="text-xs">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="filter"
            value="All"
            checked={filterOption === "All"}
            onChange={() => setFilterOption("All")}
            className="focus:ring-2 focus:ring-blue-300"
          />
          <span className={`${filterOption === "All" ? "border-b-2 border-blue-500" : ""}`}>All</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="filter"
            value="Active"
            checked={filterOption === "Active"}
            onChange={() => setFilterOption("Active")}
            className="focus:ring-2 focus:ring-blue-300"
          />
          <span className={`${filterOption === "Active" ? "border-b-2 border-blue-500" : ""}`}>Active</span>
        </label>
      </div>
    </div>
  );
}

export default FilterView;
