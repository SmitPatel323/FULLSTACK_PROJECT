import React, { useState, useEffect } from 'react';
import { Grid, Typography, CircularProgress, Box } from '@mui/material';
import StatCard from '../../components/StatCard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from '../../services/api';

const ClientDashboard = () => {
    const [stats, setStats] = useState({ pending: 0, in_transit: 0, delivered: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [ordersRes, shipmentsRes] = await Promise.all([
                    api.get('/orders/'),
                    api.get('/shipments/')
                ]);
                const pending = ordersRes.data.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
                const in_transit = shipmentsRes.data.filter(s => s.status === 'In Transit').length;
                const delivered = shipmentsRes.data.filter(s => s.status === 'Delivered').length;
                setStats({ pending, in_transit, delivered });
            } catch (error) { console.error("Failed to fetch client dashboard data:", error); }
            finally { setLoading(false); }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <CircularProgress />;

    const statCards = [
        { title: 'Pending Orders', value: stats.pending, icon: <PendingIcon /> },
        { title: 'Shipments In Transit', value: stats.in_transit, icon: <LocalShippingIcon /> },
        { title: 'Delivered Shipments', value: stats.delivered, icon: <CheckCircleIcon /> },
    ];

    return (
        <Grid container spacing={3}>
            {statCards.map((stat) => (
                <Grid item xs={12} sm={6} md={4} key={stat.title}>
                    <StatCard title={stat.title} value={stat.value} icon={stat.icon} />
                </Grid>
            ))}
        </Grid>
    );
};
export default ClientDashboard;