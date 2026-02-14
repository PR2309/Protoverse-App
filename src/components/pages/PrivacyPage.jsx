import React from 'react';

const PrivacyPage = ({ onBack }) => (
    <div className="info-page fade-in">
        {onBack && <button className="back-btn" onClick={onBack}>&larr; Back</button>}
        <h1>Privacy Policy</h1>

        <p><em>Last Updated: February 14, 2026</em></p>

        <div className="info-card">
            <h3>Your Privacy Matters</h3>
            <p>
                At Early Distress Support, we take your privacy seriously. This policy explains how we
                handle your information.
            </p>
        </div>

        <div className="info-card">
            <h3>Data Storage</h3>
            <p>
                <strong>All your data is stored locally on your device.</strong> We do not collect, transmit,
                or store any personal information on external servers. This includes:
            </p>
            <ul>
                <li>Mood check-in history</li>
                <li>Stress level data</li>
                <li>Chat conversations</li>
                <li>Personal preferences</li>
            </ul>
        </div>

        <div className="info-card">
            <h3>What We Don't Do</h3>
            <ul>
                <li>We don't sell your data</li>
                <li>We don't share your data with third parties</li>
                <li>We don't track your activity</li>
                <li>We don't require account creation</li>
                <li>We don't use cookies for tracking</li>
            </ul>
        </div>

        <div className="info-card">
            <h3>Your Control</h3>
            <p>
                You have complete control over your data:
            </p>
            <ul>
                <li>Clear your browser data to delete all information</li>
                <li>Export your data anytime (feature coming soon)</li>
                <li>Use the app without creating an account</li>
            </ul>
        </div>

        <div className="info-card">
            <h3>Future Changes</h3>
            <p>
                If we introduce features that require data collection (such as cloud sync), we will:
            </p>
            <ul>
                <li>Make them entirely optional</li>
                <li>Clearly explain what data is collected</li>
                <li>Obtain your explicit consent</li>
                <li>Update this privacy policy</li>
            </ul>
        </div>

        <div className="info-card">
            <h3>Questions?</h3>
            <p>
                If you have any questions about our privacy practices, please contact us at
                privacy@distresssupport.app
            </p>
        </div>
    </div>
);

export default PrivacyPage;
