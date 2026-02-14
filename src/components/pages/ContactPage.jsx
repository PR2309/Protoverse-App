import React from 'react';

const ContactPage = ({ onBack }) => (
    <div className="info-page fade-in">
        {onBack && <button className="back-btn" onClick={onBack}>&larr; Back</button>}
        <h1>Contact Us</h1>

        <div className="info-card">
            <h3>General Inquiries</h3>
            <p><strong>Email:</strong> support@distresssupport.app</p>
            <p>We typically respond within 24-48 hours.</p>
        </div>

        <div className="info-card">
            <h3>Crisis Support</h3>
            <p>
                <strong>If you're in crisis, please don't email us.</strong> Instead, use our emergency
                support page to access 24/7 crisis helplines:
            </p>
            <ul>
                <li><strong>AASRA:</strong> 91-22-27546669</li>
                <li><strong>Vandrevala Foundation:</strong> 1860-2662-345</li>
                <li><strong>iCall:</strong> 91-22-25521111</li>
            </ul>
        </div>

        <div className="info-card">
            <h3>Professional Partnerships</h3>
            <p><strong>Email:</strong> partnerships@distresssupport.app</p>
            <p>
                Interested in partnering with us? We work with mental health professionals, organizations,
                and educational institutions.
            </p>
        </div>

        <div className="info-card">
            <h3>Report a Bug</h3>
            <p><strong>Email:</strong> bugs@distresssupport.app</p>
            <p>
                Found a technical issue? Let us know! Please include:
            </p>
            <ul>
                <li>Device and browser information</li>
                <li>Steps to reproduce the issue</li>
                <li>Screenshots if possible</li>
            </ul>
        </div>

        <div className="info-card">
            <h3>Feature Requests</h3>
            <p><strong>Email:</strong> feedback@distresssupport.app</p>
            <p>
                We'd love to hear your ideas for improving the app!
            </p>
        </div>

        <div className="info-card">
            <h3>Social Media</h3>
            <p>Follow us for updates and mental health resources:</p>
            <ul>
                <li>Twitter: @DistressSupport</li>
                <li>Instagram: @early.distress.support</li>
                <li>LinkedIn: Early Distress Support</li>
            </ul>
        </div>

        <div className="info-card">
            <h3>Office Address</h3>
            <p>
                Early Distress Support Initiative<br />
                Mental Health Innovation Hub<br />
                Mumbai, Maharashtra, India
            </p>
        </div>
    </div>
);

export default ContactPage;
