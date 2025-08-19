import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ListAltIcon from '@mui/icons-material/ListAlt';
import logo from '../../assets/logiflow-logo.png';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/client/dashboard' },
  { text: 'My Orders', icon: <ListAltIcon />, path: '/client/orders' },
  { text: 'Track Shipments', icon: <LocalShippingIcon />, path: '/client/shipments' },
];

const ClientSidebar = ({ drawerWidth }) => {
    const navLinkStyles = ({ isActive }) => ({
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        backgroundColor: isActive ? 'rgba(3, 169, 244, 0.15)' : 'transparent',
    });

    return (
        <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', backgroundColor: 'background.paper' } }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                <img src={logo} alt="LogiFlow Logo" style={{ height: 40, marginRight: 12 }} />
                <Typography variant="h6" noWrap component="div">LogiFlow</Typography>
            </Toolbar>
            <Divider />
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    {menuItems.map((item) => (
                        <NavLink to={item.path} key={item.text} style={navLinkStyles}>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon sx={{ color: 'text.secondary' }}>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        </NavLink>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};
export default ClientSidebar;