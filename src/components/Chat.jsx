import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Chat = () => {
    const navigate = useNavigate();

    return (
        <div className="fade-in">
            <button className="back-btn" onClick={() => navigate('/')}>&larr; Back</button>
            <div className="card-elevated">
                <h1 className="mb-m">AI Support Chat</h1>
                <div className="notification mb-l">
                    <p style={{ marginBottom: 0, fontSize: '14px' }}>
                        <strong>Note:</strong> I'm here to listen, but I'm not a therapist.
                        For professional help, reach out to a licensed mental health professional.
                    </p>
                </div>
                <div className="chat-messages mb-m">
                    <div className="chat-message ai-message">
                        <p style={{ marginBottom: 0 }}>Hello! I'm here to listen without judgment. How are you feeling today?</p>
                    </div>
                </div>
                <div className="chat-input-container">
                    <textarea placeholder="Type your message..." rows="3" style={{ marginBottom: '12px' }}></textarea>
                    <button className="btn btn-primary w-full">Send</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
