import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="bg-gray-800 p-4 font-poppins
    border-b-2">
      <div className="container mx-auto flex justify-between">
        <div className="text-white text-2xl">07 | React-Router-Dom</div>
        <div className="space-x-4">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              isActive ? 
              "text-white border-b-2 border-white bg-slate-600" : "text-white"
            } 
            end
          >
            Home
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => 
              isActive ? "text-white border-b-5 border-white bor bg-slate-600" : "text-white"
            }
          >
            About
          </NavLink>
          <NavLink 
            to="/products" 
            className={({ isActive }) => 
              isActive ? "text-white border-b-2 border-white bg-slate-600" : "text-white"
            }
          >
            Products
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => 
              isActive ? "text-white border-b-2 border-white bg-slate-600" : "text-white"
            }
          >
            Contact
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
