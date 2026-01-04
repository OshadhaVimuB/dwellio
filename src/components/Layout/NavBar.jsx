import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Layout.css';

/**
 * NavBar Component
 * Responsive navigation bar with mobile hamburger menu.
 * 
 * @returns {JSX.Element} The rendered navigation bar.
 */
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
        <button 
          className="hamburger" 
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </nav>
  );
};

NavBar.propTypes = {};

export default NavBar;