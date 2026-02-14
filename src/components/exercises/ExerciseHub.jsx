import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExerciseHub = () => {
    const navigate = useNavigate();

    return (
        <div className="fade-in">
            <button className="back-btn" onClick={() => navigate('/')}>&larr; Back</button>

            <h1 className="mb-s">Stress Relief Exercises</h1>
            <p className="text-muted mb-l">Choose an exercise that suits your needs</p>

            <div className="exercise-grid mb-l">
                <button className="exercise-card" onClick={() => navigate('/exercises/box-breathing')}>
                    <h4>Box Breathing</h4>
                    <p>Calm anxiety with rhythmic breathing</p>
                </button>
                <button className="exercise-card" onClick={() => navigate('/exercises/muscle-relaxation')}>
                    <h4>Muscle Relaxation</h4>
                    <p>Release physical tension step by step</p>
                </button>
                <button className="exercise-card" onClick={() => navigate('/exercises/grounding')}>
                    <h4>5-4-3-2-1 Grounding</h4>
                    <p>Anchor yourself using all five senses</p>
                </button>
                <button className="exercise-card" onClick={() => navigate('/exercises/body-scan')}>
                    <h4>Body Scan</h4>
                    <p>Guided meditation through body regions</p>
                </button>
            </div>
        </div>
    );
};

export default ExerciseHub;
