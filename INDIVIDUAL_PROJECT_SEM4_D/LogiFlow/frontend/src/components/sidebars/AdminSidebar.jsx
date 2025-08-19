import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import logo from '../../assets/logiflow-logo.png';
import useAuth from '../../hooks/useAuth';

const AdminSidebar = ({ drawerWidth }) => {
    const { user } = useAuth();

    const menuItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard', roles: ['Admin', 'Staff', 'Delivery Agent'] },
      { text: 'Inventory', icon: <InventoryIcon />, path: '/admin/inventory', roles: ['Admin', 'Staff'] },
      { text: 'Orders', icon: <ListAltIcon />, path: '/admin/orders', roles: ['Admin', 'Staff'] },
      { text: 'Shipments', icon: <LocalShippingIcon />, path: '/admin/shipments', roles: ['Admin', 'Staff', 'Delivery Agent'] },
      { text: 'Fleet', icon: <DirectionsCarIcon />, path: '/admin/fleet', roles: ['Admin', 'Staff'] },
      { text: 'Users', icon: <PeopleIcon />, path: '/admin/users', roles: ['Admin'] },
      { text: 'Reports', icon: <AssessmentIcon />, path: '/admin/reports', roles: ['Admin', 'Staff'] },
    ];

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
                    {menuItems.filter(item => item.roles.includes(user.role)).map((item) => (
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
export default AdminSidebar;