import React from 'react';

const ServicesPage = ({ onBack }) => (
    <div className="info-page fade-in">
        {onBack && <button className="back-btn" onClick={onBack}>&larr; Back</button>}
        <h1>Our Services</h1>

        <div className="info-card">
            <h3>Daily Mood Tracking</h3>
            <p>
                Track your emotional state and stress levels daily. Build awareness of patterns and triggers
                over time with our simple check-in system.
            </p>
        </div>

        <div className="info-card">
            <h3>AI Support Chat</h3>
            <p>
                Talk to our AI companion trained to listen without judgment. While not a replacement for
                professional therapy, it provides a safe space to express your thoughts and feelings.
            </p>
        </div>

        <div className="info-card">
            <h3>Calming Exercises</h3>
            <p>
                Access guided breathing exercises, meditation techniques, and grounding practices to manage
                stress and anxiety in the moment.
            </p>
        </div>

        <div className="info-card">
            <h3>Peer Community</h3>
            <p>
                Connect with others facing similar challenges in moderated, topic-based support rooms.
                Share experiences and find solidarity.
            </p>
        </div>

        <div className="info-card">
            <h3>Crisis Support</h3>
            <p>
                Immediate access to crisis helplines, emergency contacts, and safety planning tools when
                you need help right away.
            </p>
        </div>

        <div className="info-card">
            <h3>Progress Insights</h3>
            <p>
                Visualize your mental health journey with weekly summaries, streak tracking, and personalized
                insights based on your check-ins.
            </p>
        </div>
    </div>
);

export default ServicesPage;
