import React, { useState } from "react";

// Define three different font families
const fonts = {
  default: "font-sans",
  serif: "font-serif",
  mono: "font-mono",
};

function FontChanger() {
  // State to hold the selected font family
  const [selectedFont, setSelectedFont] = useState(fonts.default);

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
              value={fonts.default}
              checked={selectedFont === fonts.default}
              onChange={handleFontChange}
            />
            Default (Sans)
          </label>
        </div>

        <div>
          <label className="mr-2">
            <input
              type="radio"
              value={fonts.serif}
              checked={selectedFont === fonts.serif}
              onChange={handleFontChange}
            />
            Serif
          </label>
        </div>

        <div>
          <label className="mr-2">
            <input
              type="radio"
              value={fonts.mono}
              checked={selectedFont === fonts.mono}
              onChange={handleFontChange}
            />
            Monospace
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
