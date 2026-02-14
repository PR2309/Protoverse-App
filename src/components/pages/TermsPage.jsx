import React from 'react';

const TermsPage = ({ onBack }) => (
    <div className="info-page fade-in">
        {onBack && <button className="back-btn" onClick={onBack}>&larr; Back</button>}
        <h1>Terms of Service</h1>

        <p><em>Last Updated: February 14, 2026</em></p>

        <div className="info-card">
            <h3>Acceptance of Terms</h3>
            <p>
                By using Early Distress Support, you agree to these terms. If you don't agree, please
                don't use the app.
            </p>
        </div>

        <div className="info-card">
            <h3>Not a Substitute for Professional Care</h3>
            <p>
                <strong>Important:</strong> This app is a support tool, not a replacement for professional
                mental health care. If you're experiencing a mental health crisis or need professional help,
                please contact a licensed mental health professional or crisis helpline immediately.
            </p>
        </div>

        <div className="info-card">
            <h3>User Responsibilities</h3>
            <p>You agree to:</p>
            <ul>
                <li>Use the app for personal, non-commercial purposes</li>
                <li>Not misuse or attempt to hack the app</li>
                <li>Be respectful in community interactions</li>
                <li>Seek professional help when needed</li>
            </ul>
        </div>

        <div className="info-card">
            <h3>Disclaimer of Warranties</h3>
            <p>
                The app is provided "as is" without warranties of any kind. We strive for accuracy and
                reliability but cannot guarantee the app will always be available or error-free.
            </p>
        </div>

        <div className="info-card">
            <h3>Limitation of Liability</h3>
            <p>
                We are not liable for any damages arising from your use of the app. This includes but is
                not limited to direct, indirect, incidental, or consequential damages.
            </p>
        </div>

        <div className="info-card">
            <h3>Changes to Terms</h3>
            <p>
                We may update these terms from time to time. Continued use of the app after changes
                constitutes acceptance of the new terms.
            </p>
        </div>
    </div>
);

export default TermsPage;
