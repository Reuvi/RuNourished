import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-darkerPurple backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/home" className="text-white text-xl font-bold">
              RecipeApp
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link to="/home" className="text-white hover:text-paleYellow transition">
              Home
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;