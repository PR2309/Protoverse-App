import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThoughtOfTheWeek from './ThoughtOfTheWeek';
import { saveMoodCheckIn, getWeeklyCheckIns, getStreak, getAverageStress, STORAGE_KEYS } from '../utils/storage';

const MOODS = [
    { symbol: '😊', label: 'Great', value: 5 },
    { symbol: '🙂', label: 'Good', value: 4 },
    { symbol: '😐', label: 'Okay', value: 3 },
    { symbol: '😔', label: 'Not Good', value: 2 },
    { symbol: '😞', label: 'Terrible', value: 1 },
];

const Home = () => {
    const navigate = useNavigate();
    const [selectedMood, setSelectedMood] = useState(null);
    const [stressLevel, setStressLevel] = useState(null);
    const [checkInComplete, setCheckInComplete] = useState(false);
    const [weeklyCheckIns, setWeeklyCheckIns] = useState(0);
    const [streak, setStreak] = useState(0);
    const [avgStress, setAvgStress] = useState(0);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        setWeeklyCheckIns(getWeeklyCheckIns().length);
        setStreak(getStreak());
        setAvgStress(getAverageStress());

        const lastCheckIn = localStorage.getItem(STORAGE_KEYS.LAST_CHECK_IN);
        if (lastCheckIn && new Date(lastCheckIn).toDateString() === new Date().toDateString()) {
            setCheckInComplete(true);
        }

        const handleBIP = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallPrompt(true);
        };
        window.addEventListener('beforeinstallprompt', handleBIP);
        return () => window.removeEventListener('beforeinstallprompt', handleBIP);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') setShowInstallPrompt(false);
        setDeferredPrompt(null);
    };

    const handleCheckInSubmit = () => {
        if (selectedMood && stressLevel) {
            saveMoodCheckIn(selectedMood, stressLevel);
            setCheckInComplete(true);
            setWeeklyCheckIns(getWeeklyCheckIns().length);
            setStreak(getStreak());
            setAvgStress(getAverageStress());
            setTimeout(() => { setSelectedMood(null); setStressLevel(null); }, 3000);
        }
    };

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h >= 0 && h < 4) return '🌙 Good Midnight';
        if (h >= 4 && h < 6) return '🌅 Good Dawn';
        if (h >= 6 && h < 12) return '☀️ Good Morning';
        if (h === 12) return '🕛 Good Noon';
        if (h > 12 && h < 17) return '🌤️ Good Afternoon';
        if (h >= 17 && h < 20) return '🌇 Good Evening';
        return '🌌 Good Night';
    };

    return (
        <div className="fade-in">
            {showInstallPrompt && (
                <div className="notification mb-l">
                    <div className="flex-between flex-wrap gap-m">
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <strong>Install App</strong>
                            <p style={{ marginBottom: 0, fontSize: '14px', marginTop: '4px' }}>
                                Install for quick access and offline support
                            </p>
                        </div>
                        <div className="flex gap-s" style={{ flexDirection: "row" }}>
                            <button className="btn btn-primary" onClick={handleInstallClick}>Install</button>
                            <button className="btn btn-secondary" onClick={() => setShowInstallPrompt(false)}>Later</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="home-hero">
                <div className="homeGreeting">
                    <h1>{getGreeting()}</h1>
                    <p className="text-muted">Welcome back to your safe space</p>
                    {streak > 0 && <div className="streak-badge">{streak} day streak</div>}
                </div>
                <ThoughtOfTheWeek />
            </div>

            <div className="card-elevated mb-l">
                <h2 className="mb-m">Daily Check-In</h2>
                {!checkInComplete ? (
                    <>
                        <p className="text-muted mb-l">How are you feeling today?</p>
                        <div className="mood-selector mb-l">
                            {MOODS.map((mood) => (
                                <div
                                    key={mood.value}
                                    className={`mood-option ${selectedMood?.value === mood.value ? 'selected' : ''}`}
                                    onClick={() => setSelectedMood(mood)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Select ${mood.label}`}
                                    title={mood.label}
                                    onKeyDown={(e) => e.key === 'Enter' && setSelectedMood(mood)}
                                >
                                    {mood.symbol}
                                </div>
                            ))}
                        </div>
                        {selectedMood && (
                            <div className="fade-in">
                                <p className="text-muted mb-m">Stress level (1–5)</p>
                                <div className="stress-selector mb-l">
                                    <div className="stress-labels">
                                        <span className="text-muted" style={{ fontSize: '12px' }}>Low</span>
                                        <span className="text-muted" style={{ fontSize: '12px' }}>High</span>
                                    </div>
                                    <div className="stress-options">
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <button
                                                key={level}
                                                className={`stress-btn ${stressLevel === level ? 'selected' : ''}`}
                                                onClick={() => setStressLevel(level)}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {stressLevel && (
                                    <button className="btn btn-primary w-full" onClick={handleCheckInSubmit}>
                                        Complete Check-In
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center fade-in">
                        <div style={{ fontSize: '36px', marginBottom: '16px', fontWeight: 700 }}>Done</div>
                        <h3>Check-In Complete</h3>
                        <p className="text-muted">Thank you for sharing how you're feeling</p>
                    </div>
                )}
            </div>

            <div className="text-center mb-l">
                <button className="btn btn-emergency" onClick={() => navigate('/emergency')}>
                    Need Help Now?
                </button>
            </div>

            <div className="card mb-l">
                <h3 className="mb-m">Weekly Progress</h3>
                <div className="mb-m">
                    <div className="flex-between" style={{ marginBottom: '8px' }}>
                        <span className="text-muted">Check-ins</span>
                        <span style={{ fontWeight: 600 }}>{weeklyCheckIns}/7</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${Math.min((weeklyCheckIns / 7) * 100, 100)}%` }}></div>
                    </div>
                </div>
                {avgStress > 0 && (
                    <p className="text-muted" style={{ fontSize: '14px', marginBottom: 0 }}>
                        Avg. stress: {avgStress}/5
                    </p>
                )}
            </div>

            <div className="card">
                <h3 className="mb-m">Quick Actions</h3>
                <div className="quick-actions">
                    <button className="quick-action-btn" onClick={() => navigate('/chat')}>
                        <span className="quick-action-icon">🤖</span>
                        <span className="quick-action-label">AI Support</span>
                    </button>
                    <button className="quick-action-btn" onClick={() => navigate('/exercises')}>
                        <span className="quick-action-icon">🧘</span>
                        <span className="quick-action-label">Exercises</span>
                    </button>
                    <button className="quick-action-btn" onClick={() => navigate('/community')}>
                        <span className="quick-action-icon">👥</span>
                        <span className="quick-action-label">Community</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
