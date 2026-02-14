import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MuscleRelaxation = () => {
    const navigate = useNavigate();
    const [active, setActive] = useState(false);
    const [step, setStep] = useState(0);
    const [phase, setPhase] = useState('tense'); // tense or release
    const [countdown, setCountdown] = useState(5);

    const muscles = [
        'Hands — clench your fists',
        'Arms — flex your biceps',
        'Shoulders — shrug upward',
        'Face — scrunch tightly',
        'Chest — take a deep breath and hold',
        'Stomach — tighten your abs',
        'Legs — press thighs together',
        'Feet — curl your toes',
    ];

    useEffect(() => {
        if (!active) {
            setStep(0);
            setPhase('tense');
            setCountdown(5);
            return;
        }

        let currentStep = 0;
        let currentPhase = 'tense';
        let secs = 5;
        setStep(0);
        setPhase('tense');
        setCountdown(5);

        const tick = setInterval(() => {
            secs--;
            if (secs <= 0) {
                if (currentPhase === 'tense') {
                    currentPhase = 'release';
                    secs = 5;
                } else {
                    currentPhase = 'tense';
                    currentStep++;
                    if (currentStep >= muscles.length) {
                        setActive(false);
                        return;
                    }
                    secs = 5;
                }
                setPhase(currentPhase);
                setStep(currentStep);
            }
            setCountdown(secs || 5);
        }, 1000);

        return () => clearInterval(tick);
    }, [active]);

    return (
        <div className="fade-in">
            <button className="back-btn" onClick={() => navigate('/exercises')}>&larr; Back</button>

            <div className="card-elevated">
                <h1 className="mb-s text-center">Progressive Muscle Relaxation</h1>
                <p className="text-muted mb-l text-center">Tense each muscle group for 5s, then release for 5s</p>

                {active ? (
                    <div className="text-center fade-in">
                        <p className="text-muted mb-s" style={{ fontSize: '14px' }}>
                            Step {step + 1} of {muscles.length}
                        </p>
                        <h3 className="mb-m">{muscles[step]}</h3>
                        <div className="exercise-timer mb-m">{countdown}</div>
                        <span className={`phase-indicator ${phase === 'tense' ? 'exhale' : 'inhale'}`}>
                            {phase === 'tense' ? 'Tense' : 'Release'}
                        </span>
                        <div className="mt-l">
                            <button className="btn btn-secondary" onClick={() => setActive(false)}>
                                Stop
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="grounding-steps mb-l">
                            {muscles.map((m, i) => (
                                <div key={i} className="grounding-step">
                                    <div className="step-number">{i + 1}</div>
                                    <div className="step-content">
                                        <strong>{m.split(' — ')[0]}</strong>
                                        <p>{m.split(' — ')[1]}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-primary w-full" onClick={() => setActive(true)}>
                            Start Exercise
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MuscleRelaxation;
