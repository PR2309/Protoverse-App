import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="app-footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4>Early Distress Support</h4>
                        <p>Supporting mental well-being for early-career individuals</p>
                    </div>
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <Link to="/about" className="footer-link">About</Link>
                        <Link to="/services" className="footer-link">Services</Link>
                        <Link to="/emergency" className="footer-link">Crisis Support</Link>
                    </div>
                    <div className="footer-section">
                        <h4>Legal</h4>
                        <Link to="/privacy" className="footer-link">Privacy</Link>
                        <Link to="/terms" className="footer-link">Terms</Link>
                        <Link to="/disclaimer" className="footer-link">Disclaimer</Link>
                    </div>
                    <div className="footer-section">
                        <h4>Contact</h4>
                        <Link to="/contact" className="footer-link">Contact Us</Link>
                        <p className="footer-text">support@distresssupport.app</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>Made with <span className="beating-heart">💙</span> for mental well-being &copy; 2026</p>
                    <p className="footer-disclaimer">
                        This app supports well-being but does not replace professional mental health care.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
