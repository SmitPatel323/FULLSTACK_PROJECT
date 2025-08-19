import React, { useState, useEffect } from 'react';
import { Grid, Typography, Paper, CircularProgress, Box } from '@mui/material';
import StatCard from '../../components/StatCard';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PendingIcon from '@mui/icons-material/Pending';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import api from '../../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/analytics/dashboard/');
                setStats(response.data.summary_stats);
            } catch (error) { console.error("Failed to fetch dashboard data:", error); }
            finally { setLoading(false); }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <CircularProgress />;
    if (!stats) return <Typography>Could not load dashboard data.</Typography>;

    const statCards = [
        { title: 'Total Products', value: stats.inventory_count, icon: <InventoryIcon /> },
        { title: 'Shipments in Transit', value: stats.in_transit_shipments, icon: <LocalShippingIcon /> },
        { title: 'Pending Orders', value: stats.pending_orders, icon: <PendingIcon /> },
        { title: 'Available Vehicles', value: stats.available_vehicles, icon: <DirectionsCarIcon /> },
    ];

    return (
        <Grid container spacing={3}>
            {statCards.map((stat) => (
                <Grid item xs={12} sm={6} md={3} key={stat.title}>
                    <StatCard title={stat.title} value={stat.value} icon={stat.icon} />
                </Grid>
            ))}
        </Grid>
    );
};
export default Dashboard;