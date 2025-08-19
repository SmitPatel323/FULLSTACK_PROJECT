import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, CircularProgress, Alert, Autocomplete } from '@mui/material';
import api from '../../services/api';

const ShipmentFormModal = ({ open, onClose, onSave }) => {
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: { order: null, assigned_vehicle: null, delivery_agent: null, estimated_delivery_date: '' }
    });
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [orders, setOrders] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [agents, setAgents] = useState([]);

    useEffect(() => {
        if (open) {
            const fetchData = async () => {
                try {
                    const [ordersRes, vehiclesRes, agentsRes] = await Promise.all([
                        api.get('/orders/?status=Pending'),
                        api.get('/fleet/?is_available=true'),
                        api.get('/users/?role=Delivery Agent')
                    ]);
                    setOrders(ordersRes.data);
                    setVehicles(vehiclesRes.data);
                    setAgents(agentsRes.data);
                } catch (err) {
                    console.error("Failed to fetch data for shipment form", err);
                    setServerError("Could not load required data for the form.");
                }
            };
            fetchData();
            reset({ order: null, assigned_vehicle: null, delivery_agent: null, estimated_delivery_date: '' });
            setServerError('');
        }
    }, [open, reset]);

    const onSubmit = async (data) => {
        setLoading(true);
        setServerError('');
        const formattedData = {
            order: data.order.id,
            assigned_vehicle: data.assigned_vehicle.id,
            delivery_agent: data.delivery_agent.id,
            estimated_delivery_date: data.estimated_delivery_date,
        };
        try {
            const response = await api.post('/shipments/', formattedData);
            onSave(response.data);
            handleClose();
        } catch (err) {
            console.error("Failed to create shipment:", err);
            setServerError(err.response?.data?.detail || 'An error occurred.');
        } finally { setLoading(false); }
    };

    const handleClose = () => { reset(); onClose(); };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Shipment</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}><Controller name="order" control={control} rules={{ required: 'An order is required' }} render={({ field }) => <Autocomplete {...field} options={orders} getOptionLabel={(o) => `Order #${o.id} - ${o.client_name}`} isOptionEqualToValue={(o, v) => o.id === v.id} onChange={(_, data) => field.onChange(data)} renderInput={(params) => <TextField {...params} label="Select Order to Ship" error={!!errors.order} helperText={errors.order?.message} />} />} /></Grid>
                        <Grid item xs={12}><Controller name="assigned_vehicle" control={control} rules={{ required: 'A vehicle is required' }} render={({ field }) => <Autocomplete {...field} options={vehicles} getOptionLabel={(v) => `${v.vehicle_model} - ${v.license_plate}`} isOptionEqualToValue={(o, v) => o.id === v.id} onChange={(_, data) => field.onChange(data)} renderInput={(params) => <TextField {...params} label="Assign Vehicle" error={!!errors.assigned_vehicle} helperText={errors.assigned_vehicle?.message} />} />} /></Grid>
                        <Grid item xs={12}><Controller name="delivery_agent" control={control} rules={{ required: 'An agent is required' }} render={({ field }) => <Autocomplete {...field} options={agents} getOptionLabel={(a) => a.username} isOptionEqualToValue={(o, v) => o.id === v.id} onChange={(_, data) => field.onChange(data)} renderInput={(params) => <TextField {...params} label="Assign Delivery Agent" error={!!errors.delivery_agent} helperText={errors.delivery_agent?.message} />} />} /></Grid>
                        <Grid item xs={12}><Controller name="estimated_delivery_date" control={control} rules={{ required: 'Est. delivery date is required' }} render={({ field }) => <TextField {...field} label="Estimated Delivery Date" type="date" fullWidth InputLabelProps={{ shrink: true }} error={!!errors.estimated_delivery_date} helperText={errors.estimated_delivery_date?.message} />} /></Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleClose} color="inherit">Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Create Shipment'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
export default ShipmentFormModal;