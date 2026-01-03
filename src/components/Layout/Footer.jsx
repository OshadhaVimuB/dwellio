import React from 'react';
import './Layout.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col brand-col">
          <h3>Dwellio.</h3>
          <p>The modern way to find your home. Simple, transparent, and built for you.</p>
        </div>
        <div className="footer-col">
          <h4>Discover</h4>
          <a href="/search">New Homes</a>
          <a href="/search">Apartments</a>
          <a href="/search">Rentals</a>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a href="/">About Us</a>
          <a href="/">Contact</a>
          <a href="/">Careers</a>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <a href="/">Privacy</a>
          <a href="/">Terms</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Dwellio Estate Agents. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;