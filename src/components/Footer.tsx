import { Icon } from '@iconify/react';
import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer-section">
            <div className="footer-container">
                <div className="footer-content">
                    {/* Left Side: Brand & About */}
                    <div className="footer-brand-section reveal-on-scroll">
                        <div className="footer-logo">UniQ</div>
                        <h3 className="footer-heading">About Us</h3>
                        <p className="footer-description">
                            A unified social-academic ecosystem designed to bring collaboration, mentoring, and event management into one digital space.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-icon" aria-label="LinkedIn">
                                <Icon icon="fa6-brands:linkedin-in" />
                            </a>

                            <a href="#" className="social-icon" aria-label="X">
                                <Icon icon="fa6-brands:x-twitter" />
                            </a>

                            <a href="#" className="social-icon" aria-label="Instagram">
                                <Icon icon="fa6-brands:instagram" />
                            </a>

                            <a href="#" className="social-icon" aria-label="Facebook">
                                <Icon icon="fa6-brands:facebook-f" />
                            </a>
                        </div>
                    </div>

                    {/* Right Side: Links Columns */}
                    <div className="footer-links-section">
                        <div className="footer-column reveal-on-scroll delay-200">
                            <h4>Pages</h4>
                            <ul>
                                <li><a href="#">Products</a></li>
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Careers</a></li>
                            </ul>
                        </div>

                        <div className="footer-column reveal-on-scroll delay-400">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><a href="#">Features</a></li>
                                <li><a href="#">Pricing</a></li>
                                <li><a href="#">Team</a></li>
                                <li><a href="#">Book a Demo</a></li>
                            </ul>
                        </div>

                        <div className="footer-column reveal-on-scroll delay-600">
                            <h4>Reach Us</h4>
                            <ul>
                                <li><a href="mailto:hello@uniq.lk">hello@uniq.lk</a></li>
                                <li><a href="tel:+94711234567">+94 70 123 4567</a></li>
                                <li><a href="tel:+94777654321">+94 76 765 4321</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom reveal-on-scroll delay-800">
                    <p className="copyright">
                        &copy; 2025 UniQ Team CS-97. All rights reserved.
                    </p>
                    <div className="footer-legal-links">
                        <a href="#">Cookies</a>
                        <span className="separator">|</span>
                        <a href="#">Terms</a>
                        <span className="separator">|</span>
                        <a href="#">Privacy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
