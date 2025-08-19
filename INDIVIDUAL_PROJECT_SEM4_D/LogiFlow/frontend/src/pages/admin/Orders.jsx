import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, CircularProgress, Typography, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Divider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PrintIcon from '@mui/icons-material/Print';
import api from '../../services/api';
import { format, isValid } from 'date-fns';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pickingList, setPickingList] = useState(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/orders/');
            setOrders(response.data);
        } catch (error) { console.error("Failed to fetch orders:", error); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const handleGeneratePickingList = async (orderId) => {
        try {
            const response = await api.get(`/orders/${orderId}/picking_list/`);
            setPickingList(response.data);
        } catch (error) { console.error("Failed to generate picking list:", error); }
    };

    const columns = [
        { field: 'id', headerName: 'Order ID', width: 100 },
        { field: 'client_name', headerName: 'Client', width: 150 },
        { field: 'status', headerName: 'Status', width: 120 },
        { field: 'created_at', headerName: 'Date Created', width: 180, valueFormatter: (params) => {
            if (!params.value) return '';
            const date = new Date(params.value);
            return isValid(date) ? format(date, 'PPpp') : 'Invalid Date';
        }},
        { field: 'actions', headerName: 'Actions', width: 150, sortable: false, renderCell: (params) => (
            <Button variant="outlined" size="small" startIcon={<PrintIcon />} onClick={() => handleGeneratePickingList(params.row.id)}>
                Picking List
            </Button>
        )}
    ];

    if (loading) return <CircularProgress />;

    return (
        <>
            <Box sx={{ height: 'calc(100vh - 150px)', width: '100%' }}>
                <Typography variant="h5" sx={{ mb: 2 }}>All Customer Orders</Typography>
                <DataGrid rows={orders} columns={columns} sx={{ backgroundColor: 'background.paper', border: 'none' }} />
            </Box>
            <Dialog open={Boolean(pickingList)} onClose={() => setPickingList(null)}>
                <DialogTitle>Picking List for Order #{pickingList?.order_id}</DialogTitle>
                <DialogContent>
                    <Typography>Customer: {pickingList?.customer}</Typography>
                    <List>
                        {pickingList?.items.map((item, index) => (
                            <React.Fragment key={index}>
                                <ListItem>
                                    <ListItemText primary={`${item.quantity}x ${item.name} (${item.sku})`} secondary={`Location: ${item.location || 'N/A'}`} />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </>
    );
};
export default Orders;