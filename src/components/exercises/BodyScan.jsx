import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BodyScan = () => {
    const navigate = useNavigate();
    const [active, setActive] = useState(false);
    const [step, setStep] = useState(0);
    const [countdown, setCountdown] = useState(10);

    const regions = [
        { name: 'Top of Head', instruction: 'Focus on any sensations at the crown of your head' },
        { name: 'Forehead & Eyes', instruction: 'Release any tension in your brow and around your eyes' },
        { name: 'Jaw & Mouth', instruction: 'Unclench your jaw. Let your tongue rest softly' },
        { name: 'Neck & Shoulders', instruction: 'Let your shoulders drop. Release the neck' },
        { name: 'Arms & Hands', instruction: 'Feel the weight of your arms. Relax your fingers' },
        { name: 'Chest & Heart', instruction: 'Notice your heartbeat. Breathe into your chest' },
        { name: 'Stomach & Core', instruction: 'Soften your belly. Let it rise and fall naturally' },
        { name: 'Hips & Lower Back', instruction: 'Release any tightness in your lower back' },
        { name: 'Legs & Feet', instruction: 'Feel the ground beneath you. Relax your toes' },
    ];

    useEffect(() => {
        if (!active) {
            setStep(0);
            setCountdown(10);
            return;
        }

        let currentStep = 0;
        let secs = 10;
        setStep(0);
        setCountdown(10);

        const tick = setInterval(() => {
            secs--;
            if (secs <= 0) {
                currentStep++;
                if (currentStep >= regions.length) {
                    setActive(false);
                    return;
                }
                setStep(currentStep);
                secs = 10;
            }
            setCountdown(secs || 10);
        }, 1000);

        return () => clearInterval(tick);
    }, [active]);

    return (
        <div className="fade-in">
            <button className="back-btn" onClick={() => navigate('/exercises')}>&larr; Back</button>

            <div className="card-elevated">
                <h1 className="mb-s text-center">Body Scan</h1>
                <p className="text-muted mb-l text-center">
                    Slowly scan through each body region. 10 seconds per area.
                </p>

                {active ? (
                    <div className="text-center fade-in">
                        <p className="text-muted mb-s" style={{ fontSize: '14px' }}>
                            Region {step + 1} of {regions.length}
                        </p>
                        <h2 className="mb-s">{regions[step].name}</h2>
                        <p className="text-muted mb-m">{regions[step].instruction}</p>
                        <div className="exercise-timer mb-m">{countdown}</div>
                        <div className="progress-bar mb-l">
                            <div
                                className="progress-fill"
                                style={{ width: `${((step + 1) / regions.length) * 100}%` }}
                            ></div>
                        </div>
                        <button className="btn btn-secondary" onClick={() => setActive(false)}>
                            Stop
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="grounding-steps mb-l">
                            {regions.map((r, i) => (
                                <div key={i} className="grounding-step">
                                    <div className="step-number">{i + 1}</div>
                                    <div className="step-content">
                                        <strong>{r.name}</strong>
                                        <p>{r.instruction}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-primary w-full" onClick={() => setActive(true)}>
                            Start Body Scan
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BodyScan;
