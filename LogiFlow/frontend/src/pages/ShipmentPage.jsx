import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import { Plus, Eye } from 'lucide-react';
import CreateShipmentModal from '../components/CreateShipmentModal';

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'Pending': return 'badge-gray';
        case 'In Transit': return 'badge-yellow';
        case 'Out for Delivery': return 'badge-blue';
        case 'Delivered': return 'badge-green';
        default: return 'badge-gray';
    }
};

export default function ShipmentPage() {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchShipments = () => { 
        apiClient.get('/shipments/')
            .then(res => { 
                setShipments(res.data); 
                setLoading(false); 
            }); 
    };
    
    useEffect(fetchShipments, []);

    if (loading) return <div>Loading shipments...</div>

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 className="page-header" style={{marginBottom: 0}}>Your Shipments</h1>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                    <Plus size={20} style={{marginRight: '8px'}}/> Create Shipment
                </button>
            </div>
            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Status</th>
                            <th>Agent</th>
                            <th>Vehicle</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shipments.length > 0 ? shipments.map(s => (
                            <tr key={s.id}>
                                <td>#{s.id}</td>
                                <td>{s.product.name}</td>
                                <td><span className={`badge ${getStatusBadgeClass(s.status)}`}>{s.status}</span></td>
                                <td>{s.agent?.user?.username || 'N/A'}</td>
                                <td>{s.vehicle?.name || 'N/A'}</td>
                                <td>{new Date(s.created_at).toLocaleDateString()}</td>
                                <td><Link to={`/shipments/track/${s.id}`} className="text-link"><Eye size={20} /></Link></td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No shipments found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <CreateShipmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onShipmentCreated={fetchShipments} />
        </div>
    );
}
