import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, CircularProgress, Alert, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import api from '../../services/api';

const UserFormModal = ({ open, onClose, onSave, user }) => {
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: { username: '', first_name: '', last_name: '', email: '', role: 'Staff', password: '' }
    });
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        if (open) {
            if (user) { reset(user); }
            else { reset({ username: '', first_name: '', last_name: '', email: '', role: 'Staff', password: '' }); }
            setServerError('');
        }
    }, [user, open, reset]);

    const onSubmit = async (data) => {
        setLoading(true);
        setServerError('');
        try {
            const response = user ? await api.put(`/users/${user.id}/`, data) : await api.post('/users/', data);
            onSave(response.data);
            handleClose();
        } catch (err) {
            console.error("Failed to save user:", err);
            setServerError(err.response?.data?.username?.[0] || 'An error occurred.');
        } finally { setLoading(false); }
    };

    const handleClose = () => { reset(); onClose(); };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}><Controller name="username" control={control} rules={{ required: 'Username is required' }} render={({ field }) => <TextField {...field} label="Username" fullWidth autoFocus error={!!errors.username} helperText={errors.username?.message} />} /></Grid>
                        <Grid item xs={12} sm={6}><Controller name="first_name" control={control} render={({ field }) => <TextField {...field} label="First Name" fullWidth />} /></Grid>
                        <Grid item xs={12} sm={6}><Controller name="last_name" control={control} render={({ field }) => <TextField {...field} label="Last Name" fullWidth />} /></Grid>
                        <Grid item xs={12}><Controller name="email" control={control} rules={{ required: 'Email is required' }} render={({ field }) => <TextField {...field} label="Email Address" type="email" fullWidth error={!!errors.email} helperText={errors.email?.message} />} /></Grid>
                        <Grid item xs={12}><Controller name="role" control={control} rules={{ required: 'Role is required' }} render={({ field }) => (
                            <FormControl fullWidth>
                                <InputLabel>Role</InputLabel>
                                <Select {...field} label="Role">
                                    <MenuItem value="Admin">Admin</MenuItem>
                                    <MenuItem value="Staff">Staff</MenuItem>
                                    <MenuItem value="Delivery Agent">Delivery Agent</MenuItem>
                                    <MenuItem value="Client">Client</MenuItem>
                                </Select>
                            </FormControl>
                        )} /></Grid>
                        <Grid item xs={12}><Controller name="password" control={control} rules={{ required: !user }} render={({ field }) => <TextField {...field} label="Password" type="password" fullWidth helperText={user ? "Leave blank to keep current password" : ""} required={!user} error={!!errors.password} />} /></Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleClose} color="inherit">Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Save User'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
export default UserFormModal;