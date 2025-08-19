import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    const pageStyle = { 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        textAlign: 'center' 
    };

    return (
        <div style={pageStyle}>
            <h1 style={{fontSize: '4rem', fontWeight: 700, color: 'var(--primary-color)'}}>404</h1>
            <h2 style={{fontSize: '1.5rem', marginTop: '1rem'}}>Page Not Found</h2>
            <p style={{marginTop: '0.5rem', color: '#6b778c'}}>Sorry, the page you are looking for does not exist.</p>
            <Link to="/" className="btn btn-primary" style={{marginTop: '1.5rem'}}>
                Go to Dashboard
            </Link>
        </div>
    );
}
