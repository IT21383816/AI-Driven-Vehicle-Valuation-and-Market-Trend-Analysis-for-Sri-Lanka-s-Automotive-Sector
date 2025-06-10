import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section - Logo & About */}
        <div className="footer-logo">
          <h2>GREEN AUTO</h2>
          <p>AI-Driven Vehicle Market Analysis & Prediction</p>
        </div>

        {/* Middle Section - Navigation Links */}
        <div className="footer-links">
          <a href="#">Home</a>
          <a href="#">Market Trends</a>
          <a href="#">Data Insights</a>
          <a href="#">Statistics</a>
          <a href="#">Team</a>
          <a href="#">Contact</a>
        </div>

        {/* Right Section - Social Links */}
        <div className="footer-social">
          <a href="#"><FaFacebook /></a>
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaLinkedin /></a>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className="footer-bottom">
        <p>© 2025 GREEN AUTO | All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
