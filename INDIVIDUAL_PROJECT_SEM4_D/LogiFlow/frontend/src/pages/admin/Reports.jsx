import React, { useState, useEffect } from 'react';
import { Grid, Typography, Paper, CircularProgress, Box } from '@mui/material';
import SimplePieChart from '../../components/charts/SimplePieChart';
import SimpleBarChart from '../../components/charts/SimpleBarChart';
import api from '../../services/api';

const Reports = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const response = await api.get('/analytics/dashboard/');
                setReportData(response.data);
            } catch (error) { console.error("Failed to fetch report data:", error); }
            finally { setLoading(false); }
        };
        fetchReportData();
    }, []);

    if (loading) return <CircularProgress />;
    if (!reportData) return <Typography>Could not load report data.</Typography>;

    const deliveryPerformanceData = [
        { name: 'On Time', value: reportData.delivery_performance.on_time },
        { name: 'Late', value: reportData.delivery_performance.total_delivered - reportData.delivery_performance.on_time },
    ];

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '400px' }}>
                    <Typography variant="h6" gutterBottom>Shipment Status Breakdown</Typography>
                    <SimplePieChart data={reportData.shipments_by_status} />
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '400px' }}>
                    <Typography variant="h6" gutterBottom>Delivery Performance</Typography>
                    <SimpleBarChart data={deliveryPerformanceData} dataKey="value" nameKey="name" />
                </Paper>
            </Grid>
        </Grid>
    );
};
export default Reports;