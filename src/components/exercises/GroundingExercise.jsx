import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GroundingExercise = () => {
    const navigate = useNavigate();
    const [active, setActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { count: 5, sense: 'See', instruction: 'Name 5 things you can see around you' },
        { count: 4, sense: 'Touch', instruction: 'Name 4 things you can physically feel' },
        { count: 3, sense: 'Hear', instruction: 'Name 3 things you can hear right now' },
        { count: 2, sense: 'Smell', instruction: 'Name 2 things you can smell' },
        { count: 1, sense: 'Taste', instruction: 'Name 1 thing you can taste' },
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setActive(false);
            setCurrentStep(0);
        }
    };

    return (
        <div className="fade-in">
            <button className="back-btn" onClick={() => navigate('/exercises')}>&larr; Back</button>

            <div className="card-elevated">
                <h1 className="mb-s text-center">5-4-3-2-1 Grounding</h1>
                <p className="text-muted mb-l text-center">
                    Engage your senses to anchor yourself in the present moment
                </p>

                {active ? (
                    <div className="fade-in text-center">
                        <div className="exercise-timer mb-s">{steps[currentStep].count}</div>
                        <h2 className="mb-s">{steps[currentStep].sense}</h2>
                        <p className="text-muted mb-l">{steps[currentStep].instruction}</p>
                        <p className="text-muted mb-l" style={{ fontSize: '14px' }}>
                            Take your time. When ready, continue.
                        </p>
                        <button className="btn btn-primary w-full" onClick={handleNext} style={{ maxWidth: '280px' }}>
                            {currentStep < steps.length - 1 ? 'Next' : 'Finish'}
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="grounding-steps mb-l">
                            {steps.map((s, i) => (
                                <div key={i} className="grounding-step">
                                    <div className="step-number">{s.count}</div>
                                    <div className="step-content">
                                        <strong>{s.sense}</strong>
                                        <p>{s.instruction}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-primary w-full" onClick={() => { setActive(true); setCurrentStep(0); }}>
                            Start Exercise
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroundingExercise;
