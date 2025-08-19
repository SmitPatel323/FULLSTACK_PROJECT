import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ship } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const pageStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' };
    const formStyle = { width: '100%', maxWidth: '400px', padding: '2rem', textAlign: 'center' };

    return (
        <div style={pageStyle}>
            <div className="card" style={formStyle}>
                <Ship size={48} color="#4f46e5" style={{ margin: '0 auto 1rem' }}/>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Sign in to LogiFlow</h2>
                {error && <p style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-input"/>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-input"/>
                    <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</button>
                </form>
                <p style={{ marginTop: '1.5rem' }}>
                    Not a member? <Link to="/signup" className="text-link">Sign up now</Link>
                </p>
            </div>
        </div>
    );
}
