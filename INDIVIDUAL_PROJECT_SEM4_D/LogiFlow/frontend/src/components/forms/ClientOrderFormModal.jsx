import React, { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, CircularProgress, Alert, IconButton, Autocomplete, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import api from '../../services/api';

const ClientOrderFormModal = ({ open, onClose, onSave }) => {
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: { items: [{ product: null, quantity: 1 }] }
    });
    const { fields, append, remove } = useFieldArray({ control, name: "items" });
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (open) {
            const fetchProducts = async () => {
                try {
                    const response = await api.get('/products/');
                    setProducts(response.data);
                } catch (err) { console.error("Failed to fetch products for form", err); }
            };
            fetchProducts();
            reset({ items: [{ product: null, quantity: 1 }] });
            setServerError('');
        }
    }, [open, reset]);

    const onSubmit = async (data) => {
        setLoading(true);
        setServerError('');
        const formattedData = {
            items: data.items.map(item => ({ product: item.product.id, quantity: parseInt(item.quantity, 10) }))
        };
        try {
            const response = await api.post('/orders/', formattedData);
            onSave(response.data);
            handleClose();
        } catch (err) {
            console.error("Failed to save order:", err);
            setServerError('An error occurred while placing the order.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Place New Order</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mb: 1 }}>Order Items</Typography>
                            {fields.map((item, index) => (
                                <Grid container spacing={2} key={item.id} sx={{ mb: 2, alignItems: 'center' }}>
                                    <Grid item xs={6}>
                                        <Controller name={`items.${index}.product`} control={control} rules={{ required: 'Product is required' }} render={({ field }) => (
                                            <Autocomplete {...field} options={products} getOptionLabel={(option) => `${option.name} (${option.sku})`} isOptionEqualToValue={(option, value) => option.id === value.id} onChange={(_, data) => field.onChange(data)} renderInput={(params) => <TextField {...params} label="Select Product" error={!!errors.items?.[index]?.product} />} />
                                        )} />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Controller name={`items.${index}.quantity`} control={control} rules={{ required: true, min: 1 }} render={({ field }) => (
                                            <TextField {...field} label="Quantity" type="number" fullWidth InputProps={{ inputProps: { min: 1 } }} error={!!errors.items?.[index]?.quantity} />
                                        )} />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <IconButton onClick={() => remove(index)} disabled={fields.length <= 1}><RemoveCircleOutlineIcon /></IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                            <Button startIcon={<AddCircleOutlineIcon />} onClick={() => append({ product: null, quantity: 1 })}>Add Another Item</Button>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleClose} color="inherit">Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Place Order'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
export default ClientOrderFormModal;