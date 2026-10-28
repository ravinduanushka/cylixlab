import { LinkedInIcon, FacebookIcon, YoutubeIcon, PhoneIcon, MailIcon } from './Icons';

const Footer = ({ compact = false, className = '' }) => {
  return (
    <footer id="about" className={`footer-section ${compact ? 'footer-compact' : ''} ${className}`}>
      <div className="footer-container">
        <h2 className="footer-title">CylixLab | 2026</h2>
        <p className="footer-copyright">
          &copy; 2026 CMWA Production. All Rights Reserved.
        </p>

        <div className="footer-socials">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
            <LinkedInIcon size={16} />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
            <FacebookIcon size={16} />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
            <YoutubeIcon size={17} />
          </a>
        </div>

        <div className="footer-contact">
          <a href="mailto:info@CylixLab.com" className="contact-item contact-email">
            <MailIcon size={16} />
            <span>info@CylixLab.com</span>
          </a>
          <span className="contact-divider" aria-hidden="true"></span>
          <a href="tel:+94779118207" className="contact-item contact-phone">
            <PhoneIcon size={15} />
            <span>+94 77 9118207</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
