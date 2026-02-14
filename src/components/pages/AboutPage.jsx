import React from 'react';

const AboutPage = ({ onBack }) => (
    <div className="info-page fade-in">
        {onBack && <button className="back-btn" onClick={onBack}>&larr; Back</button>}
        <h1>About Early Distress Support</h1>

        <div className="info-card">
            <h3>Our Mission</h3>
            <p>
                Early Distress Support is dedicated to providing accessible, compassionate mental health support
                for early-career individuals navigating the challenges of professional life, family expectations,
                and personal growth.
            </p>
        </div>

        <div className="info-card">
            <h3>Why We Exist</h3>
            <p>
                Mental health challenges among young professionals in India are at an all-time high. With
                increasing workload pressure, family expectations, and limited access to professional support,
                many suffer in silence.
            </p>
            <p>
                We believe that early intervention and accessible support can make a life-changing difference.
            </p>
        </div>

        <div className="info-card">
            <h3>Our Approach</h3>
            <ul>
                <li><strong>Accessible:</strong> Free, 24/7 support at your fingertips</li>
                <li><strong>Private:</strong> Your data stays on your device</li>
                <li><strong>Empathetic:</strong> Non-judgmental, supportive environment</li>
                <li><strong>Evidence-based:</strong> Tools backed by mental health research</li>
            </ul>
        </div>

        <div className="info-card">
            <h3>Our Team</h3>
            <p>
                We are a team of mental health professionals, technologists, and individuals with lived
                experience working together to create meaningful support tools.
            </p>
        </div>
    </div>
);

export default AboutPage;
