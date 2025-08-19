import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { Car, User } from 'lucide-react';

export default function FleetPage() {
    const [vehicles, setVehicles] = useState([]);
    const [activeShipments, setActiveShipments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
        apiClient.get('/vehicles/')
            .then(res => {
                setVehicles(res.data.vehicles);
                setActiveShipments(res.data.active_shipments);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch fleet data:", err);
                setLoading(false);
            });
    }, []);

    // Helper function to find the agent for a busy vehicle
    const getAssignedAgent = (vehicleId) => {
        const shipment = activeShipments.find(s => s.vehicle?.id === vehicleId);
        return shipment ? shipment.agent?.user?.username : 'Unknown';
    };

    if (loading) return <div>Loading fleet...</div>;

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
                        <p style={{color: '#6b778c', margin: '0.5rem 0'}}>License: {v.license_plate}</p>
                        <span className={`badge ${v.is_available ? 'badge-green' : 'badge-red'}`}>
                            {v.is_available ? 'Available' : 'In Use'}
                        </span>

                        
                        {/* If the vehicle is not available, show the assigned agent */}
                        {!v.is_available && (
                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', color: '#6b778c' }}>
                                <User size={16} style={{ marginRight: '8px' }}/>
                                <span>Assigned to: <strong>{getAssignedAgent(v.id)}</strong></span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

