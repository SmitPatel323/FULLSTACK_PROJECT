import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    useEffect(() => { apiClient.get('/auth/profile/').then(res => setProfile(res.data)); }, []);

    if (!profile) return <div>Loading Profile...</div>;

    return (
        <div>
            <h1 className="page-header">Your Profile</h1>
            <div className="card" style={{maxWidth: '600px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>    
                    <img src={profile.avatar_url} alt="Avatar" style={{width: '100px', height: '100px', borderRadius: '50%'}}/>
                    <div>
                        <h2 style={{fontSize: '1.5rem', fontWeight: 600, margin: 0}}>{profile.username}</h2>
                        <p style={{color: '#6b778c', margin: '4px 0 0 0'}}>{profile.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
