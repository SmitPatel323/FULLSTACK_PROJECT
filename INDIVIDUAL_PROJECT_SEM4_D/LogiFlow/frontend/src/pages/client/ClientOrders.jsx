import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import api from '../../services/api';
import { format, isValid } from 'date-fns';
import ClientOrderFormModal from '../../components/forms/ClientOrderFormModal';

const ClientOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/orders/');
            setOrders(response.data);
        } catch (error) { console.error("Failed to fetch orders:", error); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);
    
    const handleSave = () => {
        setIsModalOpen(false);
        fetchOrders();
    };

    const columns = [
        { field: 'id', headerName: 'Order ID', width: 100 },
        { field: 'status', headerName: 'Status', width: 150 },
        { field: 'items', headerName: 'Items', flex: 1, minWidth: 300, renderCell: (params) => (
            <Typography variant="body2" noWrap>
              {params.value.map(item => `${item.quantity}x ${item.product_name}`).join(', ')}
            </Typography>
        )},
        { field: 'created_at', headerName: 'Date Placed', width: 180, valueFormatter: (params) => {
            if (!params.value) return '';
            const date = new Date(params.value);
            return isValid(date) ? format(date, 'PPpp') : 'Invalid Date';
        }},
    ];

    if (loading) return <CircularProgress />;

    return (
        <>
            <Box sx={{ height: 'calc(100vh - 150px)', width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5">My Orders</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>
                        Place New Order
                    </Button>
                </Box>
                <DataGrid rows={orders} columns={columns} sx={{ backgroundColor: 'background.paper', border: 'none' }} />
            </Box>
            <ClientOrderFormModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
        </>
    );
};
export default ClientOrders;
