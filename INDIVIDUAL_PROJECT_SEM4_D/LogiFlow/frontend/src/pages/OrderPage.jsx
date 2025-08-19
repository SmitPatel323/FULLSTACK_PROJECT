import React, { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, Typography, Grid, TextField, Autocomplete, IconButton, Alert } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const OrderPage = () => {
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: { full_name: '', address: '', phone_number: '', items: [{ product: null, quantity: 1 }] }
    });
    const { fields, append, remove } = useFieldArray({ control, name: "items" });
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products/');
                setProducts(response.data);
            } catch (err) { console.error("Failed to fetch products for form", err); }
        };
        fetchProducts();
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        const formattedData = {
            ...data,
            items: data.items.map(item => ({ product: item.product.id, quantity: parseInt(item.quantity, 10) }))
        };
        try {
            const response = await api.post('/orders/', formattedData);
            // On success, create a shipment for this order
            const shipmentData = { order: response.data.id };
            const shipmentResponse = await api.post('/shipments/', shipmentData);
            navigate(`/shipments/${shipmentResponse.data.id}`);
        } catch (err) {
            console.error("Failed to place order:", err);
            setError('An error occurred while placing the order.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Place a New Order</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid item xs={12}><Controller name="full_name" control={control} rules={{ required: 'Full name is required' }} render={({ field }) => <TextField {...field} label="Full Name" fullWidth error={!!errors.full_name} helperText={errors.full_name?.message} />} /></Grid>
                    <Grid item xs={12}><Controller name="address" control={control} rules={{ required: 'Address is required' }} render={({ field }) => <TextField {...field} label="Delivery Address" fullWidth multiline rows={3} error={!!errors.address} helperText={errors.address?.message} />} /></Grid>
                    <Grid item xs={12}><Controller name="phone_number" control={control} rules={{ required: 'Phone number is required' }} render={({ field }) => <TextField {...field} label="Phone Number" fullWidth error={!!errors.phone_number} helperText={errors.phone_number?.message} />} /></Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mb: 1 }}>Order Items</Typography>
                        {fields.map((item, index) => (
                            <Grid container spacing={2} key={item.id} sx={{ mb: 2, alignItems: 'center' }}>
                                <Grid item xs={6}><Controller name={`items.${index}.product`} control={control} rules={{ required: 'Product is required' }} render={({ field }) => <Autocomplete {...field} options={products} getOptionLabel={(option) => `${option.name} (${option.sku})`} isOptionEqualToValue={(option, value) => option.id === value.id} onChange={(_, data) => field.onChange(data)} renderInput={(params) => <TextField {...params} label="Select Product" error={!!errors.items?.[index]?.product} />} />} /></Grid>
                                <Grid item xs={4}><Controller name={`items.${index}.quantity`} control={control} rules={{ required: true, min: 1 }} render={({ field }) => <TextField {...field} label="Quantity" type="number" fullWidth InputProps={{ inputProps: { min: 1 } }} error={!!errors.items?.[index]?.quantity} />} /></Grid>
                                <Grid item xs={2}><IconButton onClick={() => remove(index)} disabled={fields.length <= 1}><RemoveCircleOutlineIcon /></IconButton></Grid>
                            </Grid>
                        ))}
                        <Button startIcon={<AddCircleOutlineIcon />} onClick={() => append({ product: null, quantity: 1 })}>Add Item</Button>
                    </Grid>
                    {error && <Grid item xs={12}><Alert severity="error">{error}</Alert></Grid>}
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" size="large" disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Place Order & Track'}</Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};
export default OrderPage;