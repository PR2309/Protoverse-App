import React from 'react';
import { useNavigate } from 'react-router-dom';

const Community = () => {
    const navigate = useNavigate();

    return (
        <div className="fade-in">
            <button className="back-btn" onClick={() => navigate('/')}>&larr; Back</button>
            <div className="card-elevated">
                <h1 className="mb-m">Peer Support Community</h1>
                <p className="text-muted mb-l">Connect with others facing similar challenges</p>
                <div className="topic-rooms mb-l">
                    <button className="topic-room-btn">Early-Career Stress</button>
                    <button className="topic-room-btn">Family Expectations</button>
                    <button className="topic-room-btn">Burnout & Exhaustion</button>
                    <button className="topic-room-btn">Hope & Progress</button>
                </div>
            </div>
        </div>
    );
};

export default Community;
