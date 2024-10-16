import React, { useState } from "react";

// Define three different custom font families
const fonts = {
  titillium: "font-titillium",
  lato: "font-lato",
  ubuntu: "font-ubuntu",
};

function FontChanger() {
  // State to hold the selected font family
  const [selectedFont, setSelectedFont] = useState(fonts.titillium);

  // Handle font change
  const handleFontChange = (event) => {
    setSelectedFont(event.target.value);
  };

  return (
    <div className="p-5">
      <h2 className={`${selectedFont} text-2xl mb-4`}>Font Changer Component</h2>

      <div className="space-y-2">
        <div>
          <label className="mr-2">
            <input
              type="radio"
              value={fonts.titillium}
              checked={selectedFont === fonts.titillium}
              onChange={handleFontChange}
            />
            titillium (Serif)
          </label>
        </div>

        <div>
          <label className="mr-2">
            <input
              type="radio"
              value={fonts.lato}
              checked={selectedFont === fonts.lato}
              onChange={handleFontChange}
            />
            Lato (Sans-serif)
          </label>
        </div>

        <div>
          <label className="mr-2">
            <input
              type="radio"
              value={fonts.ubuntu}
              checked={selectedFont === fonts.ubuntu}
              onChange={handleFontChange}
            />
            Ubuntu (Sans-serif)
          </label>
        </div>
      </div>

      <p className={`${selectedFont} text-lg mt-4`}>
        This is an example of text that will change its font based on your selection.
      </p>
    </div>
  );
}

export default FontChanger;
