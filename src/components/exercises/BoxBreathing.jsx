import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BoxBreathing = () => {
    const navigate = useNavigate();
    const [active, setActive] = useState(false);
    const [phase, setPhase] = useState('ready');
    const [phaseLabel, setPhaseLabel] = useState('Ready');
    const [countdown, setCountdown] = useState(4);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        if (!active) {
            setPhase('ready');
            setPhaseLabel('Ready');
            setCountdown(4);
            setTimer(0);
            return;
        }

        const phases = [
            { key: 'inhale', label: 'Inhale' },
            { key: 'hold', label: 'Hold' },
            { key: 'exhale', label: 'Exhale' },
            { key: 'hold', label: 'Hold' },
        ];
        let phaseIndex = 0;
        let seconds = 4;

        setPhase(phases[0].key);
        setPhaseLabel(phases[0].label);
        setCountdown(4);

        const tick = setInterval(() => {
            seconds--;
            if (seconds <= 0) {
                phaseIndex = (phaseIndex + 1) % phases.length;
                setPhase(phases[phaseIndex].key);
                setPhaseLabel(phases[phaseIndex].label);
                seconds = 4;
            }
            setCountdown(seconds || 4);
            setTimer(prev => prev + 1);
        }, 1000);

        return () => clearInterval(tick);
    }, [active]);

    const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    return (
        <div className="fade-in">
            <button className="back-btn" onClick={() => navigate('/exercises')}>&larr; Back</button>

            <div className="card-elevated text-center">
                <h1 className="mb-s">Box Breathing</h1>
                <p className="text-muted mb-l">4 seconds each: inhale, hold, exhale, hold</p>

                <div className="breathing-circle mb-m">
                    <div
                        className={`breathing-circle-inner phase-${phase}${active ? ' active' : ''}`}
                    >
                        <span>{active ? countdown : 'Start'}</span>
                    </div>
                </div>

                <div className="mb-m">
                    <span className={`phase-indicator ${phase}`}>{phaseLabel}</span>
                </div>

                {active && (
                    <p className="text-muted mb-m" style={{ fontSize: '14px' }}>
                        Session: {fmt(timer)}
                    </p>
                )}

                <button
                    className={`btn ${active ? 'btn-secondary' : 'btn-primary'} w-full`}
                    onClick={() => setActive(!active)}
                    style={{ maxWidth: '280px' }}
                >
                    {active ? 'Stop' : 'Start Exercise'}
                </button>
            </div>
        </div>
    );
};

export default BoxBreathing;
