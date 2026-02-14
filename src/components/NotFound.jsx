import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="fade-in text-center" style={{ padding: 'var(--space-xl) var(--space-m)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <h1 className="mb-m" style={{ fontSize: '4rem' }}>404</h1>
            <h2 className="mb-l">Page Not Found</h2>
            <p className="text-muted mb-xl">
                Oops! The page you are looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="btn btn-primary">
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;
