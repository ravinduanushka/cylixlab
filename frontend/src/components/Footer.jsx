import React from 'react';
import { LinkedInIcon, FacebookIcon, YoutubeIcon, PhoneIcon } from './Icons';

const Footer = () => {
  return (
    <footer id="about" className="footer-section">
      <div className="footer-container">
        <h2 className="footer-title">CylixLab | 2026</h2>
        <p className="footer-copyright">
          @2026 CMWA Production . All Right Reserved.
        </p>

        <div className="footer-socials">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
            <FacebookIcon />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
            <YoutubeIcon />
          </a>
        </div>

        <div className="footer-contact">
          <a href="mailto:info@CylixLab.com" className="contact-item contact-email">
            info@CylixLab.com
          </a>
          <span className="contact-divider"></span>
          <a href="tel:+94771234567" className="contact-item contact-phone">
            <PhoneIcon />
            <span>+94 77 123 4567</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
