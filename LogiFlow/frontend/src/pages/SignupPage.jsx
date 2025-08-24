import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signup(username, email, password);
            navigate('/login');
        } catch (err) {
            setError('Failed to create account. Email may be in use.');
        } finally {
            setLoading(false);
        }
    };
    
    const pageStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' };
    const formStyle = { width: '100%', maxWidth: '400px', padding: '2rem', textAlign: 'center' };
    
    const passwordContainerStyle = { position: 'relative', display: 'flex', alignItems: 'center' };
    const iconStyle = { position: 'absolute', right: '12px', cursor: 'pointer', color: '#6b778c' };

    return (
        <div style={pageStyle}>
            <div className="card" style={formStyle}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Create Your Account</h2>
                {error && <p style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required className="form-input"/>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-input"/>
                    <div style={passwordContainerStyle}>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="form-input"
                        />
                        <span onClick={() => setShowPassword(!showPassword)} style={iconStyle}>
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Sign Up'}</button>
                </form>
                <p style={{ marginTop: '1.5rem' }}>
                    Already have an account? <Link to="/login" className="text-link">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
