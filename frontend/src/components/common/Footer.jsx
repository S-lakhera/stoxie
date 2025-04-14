import React from 'react';
import './Footer.css';
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube
} from 'react-icons/fa'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-sections">
        <div className="footer-col">
          <h3>About Stoxie</h3>
          <p>Stoxie is your gateway to stock market simulations, portfolio tracking, and trading education. Learn, invest, and grow – risk free.</p>
        </div>

        <div className="footer-col">
          <h3>Trading Tools</h3>
          <ul>
            <li>Real-time Simulations</li>
            <li>Portfolio Tracker</li>
            <li>Watchlists</li>
            <li>Market Insights</li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Resources</h3>
          <ul>
            <li>Stock Market Basics</li>
            <li>Investment Strategies</li>
            <li>Trading Tips</li>
            <li>FAQ</li>
          </ul>
        </div>

        <div className="footer-col social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedinIn /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Stoxie. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
