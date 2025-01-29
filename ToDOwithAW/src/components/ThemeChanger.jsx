import React from 'react';

function ThemeChanger({ currentTheme, setTheme, isAdmin = false }) {
  return (
    <div className="space-x-4 flex items-center">
      <div className={`px-3 rounded-full border ${isAdmin ? 'border-gray-600 bg-gray-800' : 'border-gray-400 bg-gray-600'}`}>
        <span className="text-sm text-gray-400">{isAdmin ? 'Admin View' : 'User View'}</span>
      </div>

      <div className="flex flex-col items-center">
        <button
          className={`w-3 h-3 rounded-full border-2 ${currentTheme === 'dark' ? 'border-white' : 'border-transparent'} bg-black focus:outline-none`}
          onClick={() => setTheme('dark')}
          aria-label="Dark Theme"
        />
        {currentTheme === 'dark' && <div className="w-2 mt-1 h-0.5 bg-white"></div>}
      </div>
      
      <div className="flex flex-col items-center">
        <button
          className={`w-3 h-3 rounded-full border-2 ${currentTheme === 'light' ? 'border-black' : 'border-transparent'} bg-white focus:outline-none`}
          onClick={() => setTheme('light')}
          aria-label="Light Theme"
        />
        {currentTheme === 'light' && <div className="w-2 mt-1 h-0.5 bg-black"></div>}
      </div>
      
      <div className="flex flex-col items-center">
        <button
          className={`w-3 h-3 rounded-full border-2 ${currentTheme === 'green' ? 'border-white' : 'border-transparent'} bg-cyan-800 focus:outline-none`}
          onClick={() => setTheme('green')}
          aria-label="Purple Theme"
        />
        {currentTheme === 'green' && <div className="w-2 mt-1 h-0.5 bg-white"></div>}
      </div>
    </div>
  );
}

export default ThemeChanger;