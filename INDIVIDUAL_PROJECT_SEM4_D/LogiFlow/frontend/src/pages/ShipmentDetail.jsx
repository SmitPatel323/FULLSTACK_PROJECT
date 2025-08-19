import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Grid, Button, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Map, Marker } from '@vis.gl/react-google-maps';
import api from '../services/api';

const ShipmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchShipment = useCallback(async () => {
        try {
            const response = await api.get(`/shipments/${id}/`);
            setShipment(response.data);
        } catch (err) {
            console.error("Failed to fetch shipment details:", err);
            setError("Could not load shipment details.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchShipment();
        const interval = setInterval(() => {
            api.post(`/shipments/${id}/update_location/`)
                .then(response => {
                    setShipment(prev => prev && prev.id === response.data.id ? {...prev, ...response.data} : prev);
                })
                .catch(err => console.log("No location update needed or error:", err.response?.data?.detail));
        }, 5000); // Update every 5 seconds for a smoother simulation

        return () => clearInterval(interval);
    }, [id, fetchShipment]);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!shipment) return <Typography>Shipment not found.</Typography>;
    
    const position = {
        lat: shipment.current_lat || shipment.start_lat,
        lng: shipment.current_lng || shipment.start_lng,
    };

    return (
        <Box>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>Back to Shipments</Button>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h5" gutterBottom>Shipment #{shipment.id}</Typography>
                        <Typography><strong>Status:</strong> {shipment.status}</Typography>
                        <Typography><strong>Customer:</strong> {shipment.order.full_name}</Typography>
                        <Typography><strong>Destination:</strong> {shipment.order.address}</Typography>
                        <Typography><strong>Predicted Delivery:</strong> {shipment.predicted_delivery_hours ? `${parseFloat(shipment.predicted_delivery_hours).toFixed(1)} hours` : 'Calculating...'}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ height: '500px', width: '100%' }}>
                        <Map center={position} zoom={12} mapId="logiflow-map" gestureHandling={'greedy'}>
                            <Marker position={position} />
                        </Map>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
export default ShipmentDetail;