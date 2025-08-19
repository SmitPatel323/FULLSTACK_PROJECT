import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { Car } from 'lucide-react';

export default function FleetPage() {
    const [vehicles, setVehicles] = useState([]);
    useEffect(() => { apiClient.get('/vehicles/').then(res => setVehicles(res.data)); }, []);

    return (
        <div>
            <h1 className="page-header">Vehicle Fleet</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {vehicles.map(v => (
                    <div key={v.id} className="card">
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <h2 style={{fontWeight: 600, fontSize: '1.25rem', margin: 0}}>{v.name}</h2>
                            <Car />
                        </div>
                        <p style={{color: '#6b778c'}}>License: {v.license_plate}</p>
                        <span className={`badge ${v.is_available ? 'badge-green' : 'badge-red'}`}>
                            {v.is_available ? 'Available' : 'In Use'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
