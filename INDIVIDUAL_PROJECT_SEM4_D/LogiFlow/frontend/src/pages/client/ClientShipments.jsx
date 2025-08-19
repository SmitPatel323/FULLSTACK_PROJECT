import React, { useState, useEffect, useCallback } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { format, isValid } from 'date-fns';

const ClientShipments = () => {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchShipments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/shipments/');
            setShipments(response.data);
        } catch (error) { console.error("Failed to fetch shipments:", error); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchShipments(); }, [fetchShipments]);

    const columns = [
        { field: 'id', headerName: 'Shipment ID', width: 120 },
        { field: 'order_id', headerName: 'Order ID', width: 100, valueGetter: (params) => params.row.order?.id || 'N/A' },
        { field: 'status', headerName: 'Status', width: 150 },
        { field: 'estimated_delivery_date', headerName: 'Est. Delivery', width: 180, valueFormatter: (params) => {
            if (!params.value) return '';
            const date = new Date(params.value);
            return isValid(date) ? format(new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000), 'P') : 'Invalid Date';
        }},
    ];

    if (loading) return <CircularProgress />;

    return (
        <Box sx={{ height: 'calc(100vh - 150px)', width: '100%' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>My Shipments</Typography>
            <DataGrid
                rows={shipments}
                columns={columns}
                onRowClick={(params) => navigate(`/client/shipments/${params.id}`)}
                sx={{ backgroundColor: 'background.paper', border: 'none', '& .MuiDataGrid-row:hover': { cursor: 'pointer' } }}
            />
        </Box>
    );
};
export default ClientShipments;