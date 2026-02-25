import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Community = () => {
    const navigate = useNavigate();
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showToast, setShowToast] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleRoomClick = () => {
        if (!isOnline) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }
        setShowModal(true);
    };

    return (
        <div className="fade-in">
            <button className="back-btn" onClick={() => navigate('/')}>&larr; Back</button>
            <div className="card-elevated">
                <h1 className="mb-m">Peer Support Community</h1>
                <p className="text-muted mb-l">Connect with others facing similar challenges</p>
                <div className="topic-rooms mb-l">
                    <button className="topic-room-btn" onClick={handleRoomClick}>Early-Career Stress</button>
                    <button className="topic-room-btn" onClick={handleRoomClick}>Family Expectations</button>
                    <button className="topic-room-btn" onClick={handleRoomClick}>Burnout & Exhaustion</button>
                    <button className="topic-room-btn" onClick={handleRoomClick}>Hope & Progress</button>
                </div>
            </div>

            {showToast && (
                <div className="toast-notification">
                    You need to be online to use this feature
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
                        <h2>Coming Soon</h2>
                        <p>We are working hard to bring this feature to you.<br />Stay tuned!</p>
                    </div>
                </div>
            )}

            <style>{`
                .toast-notification {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #ff4d4f;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 1000;
                    animation: fadeInUp 0.3s ease;
                }
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 2000;
                    animation: fadeIn 0.2s ease;
                }
                .modal-content {
                    backdrop-filter: blur(5px) invert(20%);
                    padding: 32px;
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-l);
                    position: relative;
                    max-width: 400px;
                    width: 90%;
                    text-align: center;
                    box-shadow: var(--shadow-l);
                    animation: scaleUp 0.3s ease;
                }
                .modal-close {
                    position: absolute;
                    top: 12px;
                    right: 16px;
                    background: transparent;
                    border-radius: 50%;
                    padding-inline:6px;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: var(--text-muted);
                    transition: transform 0.3s ease, color 0.3s ease;
                    display: inline-block;
                }
                .modal-close:hover {
                    background: #747373ff;
                    color: var(--text-primary);
                    transform: rotate(90deg);
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translate(-50%, 20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleUp {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default Community;
