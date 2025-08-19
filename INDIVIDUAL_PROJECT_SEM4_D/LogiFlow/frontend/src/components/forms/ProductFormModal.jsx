import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, CircularProgress, Alert } from '@mui/material';
import api from '../../services/api';

const ProductFormModal = ({ open, onClose, onSave, product }) => {
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: { name: '', sku: '', quantity: 0 }
    });
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        if (open) {
            if (product) { reset(product); }
            else { reset({ name: '', sku: '', quantity: 0 }); }
            setServerError('');
        }
    }, [product, open, reset]);

    const onSubmit = async (data) => {
        setLoading(true);
        setServerError('');
        try {
            const response = product ? await api.put(`/products/${product.id}/`, data) : await api.post('/products/', data);
            onSave(response.data);
            handleClose();
        } catch (err) {
            console.error("Failed to save product:", err);
            setServerError(err.response?.data?.sku?.[0] || 'An error occurred.');
        } finally { setLoading(false); }
    };

    const handleClose = () => { reset(); onClose(); };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}><Controller name="name" control={control} rules={{ required: 'Product name is required' }} render={({ field }) => <TextField {...field} label="Product Name" fullWidth autoFocus error={!!errors.name} helperText={errors.name?.message} />} /></Grid>
                        <Grid item xs={12} sm={6}><Controller name="sku" control={control} rules={{ required: 'SKU is required' }} render={({ field }) => <TextField {...field} label="SKU" fullWidth error={!!errors.sku} helperText={errors.sku?.message} />} /></Grid>
                        <Grid item xs={12} sm={6}><Controller name="quantity" control={control} rules={{ required: 'Quantity is required', min: 0 }} render={({ field }) => <TextField {...field} label="Quantity" type="number" fullWidth error={!!errors.quantity} helperText={errors.quantity?.message} />} /></Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleClose} color="inherit">Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Save Product'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
export default ProductFormModal;