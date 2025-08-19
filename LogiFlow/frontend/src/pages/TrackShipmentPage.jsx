import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../services/api';
import ShipmentTrackerMap from '../components/ShipmentTrackerMap';
import { Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react';

// Helper function to get a weather icon based on the forecast text
const getWeatherIcon = (forecast) => {
    if (!forecast) return <Sun size={24} />;
    const lowerCaseForecast = forecast.toLowerCase();
    if (lowerCaseForecast.includes('rain') || lowerCaseForecast.includes('shower')) return <CloudRain size={24} color="#3b82f6" />;
    if (lowerCaseForecast.includes('storm')) return <CloudLightning size={24} color="#f59e0b" />;
    if (lowerCaseForecast.includes('cloud')) return <Cloud size={24} color="#6b7280" />;
    return <Sun size={24} color="#f97316" />;
};

export default function TrackShipmentPage() {
    const { id } = useParams();
    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchShipment = useCallback(() => {
        setLoading(true);
        apiClient.get(`/shipments/${id}/`)
            .then(res => {
                setShipment(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch shipment:", err);
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        fetchShipment();
    }, [fetchShipment]);

    const handleDeliveryStatusChange = async (newStatus) => {
        if (shipment && shipment.status === newStatus) {
            return;
        }

        try {
            if (newStatus === 'Delivered') {
                await apiClient.post(`/shipments/${id}/deliver/`);
            } else {
                await apiClient.post(`/shipments/${id}/update_status/`, { status: newStatus });
            }
            fetchShipment();
        } catch (error) {
            console.error("Failed to update shipment status:", error);
        }
    };

    if (loading) return <div>Loading Shipment Details...</div>;
    if (!shipment) return <div>Shipment not found.</div>;

    return (
        <div style={{height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <h1 className="page-header">Tracking Shipment #{shipment.id}</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div className="card">
                    <h3>Status</h3>
                    <p style={{ fontWeight: 'bold', color: shipment.status === 'Delivered' ? 'var(--secondary-color)' : 'inherit' }}>
                        {shipment.status}
                    </p>
                </div>
                <div className="card"><h3>Origin</h3><p>{shipment.start_address}</p></div>
                <div className="card"><h3>Destination</h3><p>{shipment.end_address}</p></div>
                <div className="card" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    {getWeatherIcon(shipment.weather_forecast)}
                    <div>
                        <h3 style={{margin: 0}}>Weather</h3>
                        <p style={{margin: 0}}>{shipment.weather_forecast || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div className="card" style={{ flex: 1, padding: 0 }}>
                <ShipmentTrackerMap 
                    shipment={shipment} 
                    onDeliveryStatusChange={handleDeliveryStatusChange} 
                />
            </div>
        </div>
    );
}


