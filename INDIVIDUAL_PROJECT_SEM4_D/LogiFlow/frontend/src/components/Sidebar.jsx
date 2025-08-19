import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AssessmentIcon from '@mui/icons-material/Assessment';
import logo from '../assets/logiflow-logo.png';

const Sidebar = ({ drawerWidth }) => {
    const menuItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
      { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
      { text: 'Fleet', icon: <DirectionsCarIcon />, path: '/fleet' },
      { text: 'Place Order', icon: <ListAltIcon />, path: '/orders' },
      { text: 'Shipments', icon: <LocalShippingIcon />, path: '/shipments' },
      { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
    ];
    const navLinkStyles = { textDecoration: 'none', color: 'inherit', display: 'block' };

    return (
        <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', backgroundColor: 'background.paper', borderRight: '1px solid rgba(255, 255, 255, 0.12)' } }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, height: '80px' }}>
                <img src={logo} alt="LogiFlow Logo" style={{ height: 40, marginRight: 12 }} />
                <Typography variant="h6" noWrap component="div" fontWeight="700">LogiFlow</Typography>
            </Toolbar>
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    {menuItems.map((item) => (
                        <NavLink to={item.path} key={item.text} style={navLinkStyles}>
                            {({ isActive }) => (
                                <ListItem disablePadding sx={{ my: 1 }}>
                                    <ListItemButton selected={isActive} sx={{ borderRadius: 2, mx: 2, '&.Mui-selected': { backgroundColor: 'rgba(0, 150, 255, 0.1)' } }}>
                                        <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'text.secondary' }}>{item.icon}</ListItemIcon>
                                        <ListItemText primary={item.text} />
                                    </ListItemButton>
                                </ListItem>
                            )}
                        </NavLink>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};
export default Sidebar;