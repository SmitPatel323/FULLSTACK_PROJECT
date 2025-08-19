import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, CircularProgress, Alert } from '@mui/material';
import api from '../../services/api';

const FleetFormModal = ({ open, onClose, onSave, vehicle }) => {
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: { vehicle_model: '', license_plate: '' }
    });
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        if (open) {
            if (vehicle) { reset(vehicle); }
            else { reset({ vehicle_model: '', license_plate: '' }); }
            setServerError('');
        }
    }, [vehicle, open, reset]);

    const onSubmit = async (data) => {
        setLoading(true);
        setServerError('');
        try {
            const response = vehicle ? await api.put(`/fleet/${vehicle.id}/`, data) : await api.post('/fleet/', data);
            onSave(response.data);
            handleClose();
        } catch (err) {
            console.error("Failed to save vehicle:", err);
            setServerError(err.response?.data?.license_plate?.[0] || 'An error occurred.');
        } finally { setLoading(false); }
    };

    const handleClose = () => { reset(); onClose(); };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}><Controller name="vehicle_model" control={control} rules={{ required: 'Model is required' }} render={({ field }) => <TextField {...field} label="Vehicle Model" fullWidth autoFocus error={!!errors.vehicle_model} helperText={errors.vehicle_model?.message} />} /></Grid>
                        <Grid item xs={12}><Controller name="license_plate" control={control} rules={{ required: 'License plate is required' }} render={({ field }) => <TextField {...field} label="License Plate" fullWidth error={!!errors.license_plate} helperText={errors.license_plate?.message} />} /></Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleClose} color="inherit">Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Save Vehicle'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
export default FleetFormModal;