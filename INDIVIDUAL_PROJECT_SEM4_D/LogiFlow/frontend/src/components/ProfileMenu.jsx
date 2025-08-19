import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Avatar, Menu, MenuItem, Typography, Divider } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import useAuth from '../hooks/useAuth';

const ProfileMenu = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleLogout = () => {
        handleClose();
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <Box>
            <IconButton onClick={handleMenu} size="large">
                <Avatar sx={{ bgcolor: 'secondary.main' }}>{user.username.charAt(0).toUpperCase()}</Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle1">{user.username}</Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 1 }} /> Logout</MenuItem>
            </Menu>
        </Box>
    );
};
export default ProfileMenu;