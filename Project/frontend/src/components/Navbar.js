import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-darkerPurple backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* The navbar is 4rem (h-16) high, so we use h-full on the logo to match */}
        <div className="flex items-center justify-between h-16">
          {/* Left side (logo/link) */}
          <div className="flex items-center h-full">
            <Link to="/home" className="flex items-center h-full">
              <img
                src="/images/logo_dark_background.png"
                alt="Logo"
                className="h-full w-[200px] object-contain"
              />
            </Link>
          </div>

          {/* Right side (nav links) */}
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