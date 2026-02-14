import React from 'react';

const DisclaimerPage = ({ onBack }) => (
    <div className="info-page fade-in">
        {onBack && <button className="back-btn" onClick={onBack}>&larr; Back</button>}
        <h1>Medical Disclaimer</h1>

        <div className="info-card">
            <h3>Important Notice</h3>
            <p>
                <strong>Early Distress Support is not a medical or mental health service.</strong> The
                information and tools provided are for educational and supportive purposes only.
            </p>
        </div>

        <div className="info-card">
            <h3>Not Professional Medical Advice</h3>
            <p>
                The content in this app, including AI-generated responses, should not be considered
                professional medical advice, diagnosis, or treatment. Always seek the advice of qualified
                health providers with questions about medical conditions.
            </p>
        </div>

        <div className="info-card">
            <h3>In Case of Emergency</h3>
            <p>
                <strong>If you are experiencing a mental health crisis or emergency:</strong>
            </p>
            <ul>
                <li>Call emergency services (112 in India)</li>
                <li>Contact a crisis helpline immediately</li>
                <li>Go to the nearest emergency room</li>
                <li>Reach out to a trusted friend or family member</li>
            </ul>
            <p>
                <strong>Do not rely solely on this app during a crisis.</strong>
            </p>
        </div>

        <div className="info-card">
            <h3>AI Limitations</h3>
            <p>
                Our AI chat feature is designed to provide supportive conversation, but it:
            </p>
            <ul>
                <li>Cannot diagnose mental health conditions</li>
                <li>Cannot prescribe treatment</li>
                <li>Cannot replace human therapists</li>
                <li>May make mistakes or provide incomplete information</li>
            </ul>
        </div>

        <div className="info-card">
            <h3>Your Responsibility</h3>
            <p>
                You are responsible for your own health decisions. This app is a tool to support your
                well-being, but professional care from licensed providers is essential for serious mental
                health concerns.
            </p>
        </div>

        <div className="info-card">
            <h3>Data Accuracy</h3>
            <p>
                While we strive for accuracy, we make no guarantees about the completeness, reliability,
                or accuracy of information provided through this app.
            </p>
        </div>
    </div>
);

export default DisclaimerPage;
