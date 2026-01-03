import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

const NavBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        {/* Logo */}
        <Link to="/" className="logo">
          Dwellio<span className="dot">.</span>
        </Link>

        {/* Desktop Menu */}
        <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/search" onClick={() => setMobileOpen(false)}>Properties</Link>
          <Link to="/search" onClick={() => setMobileOpen(false)}>Favourites</Link>
          
          {/* Sign In Button */}
          <Link to="/search" className="btn-nav">Sign In</Link>
        </div>

        {/* Mobile Toggle */}
        <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;