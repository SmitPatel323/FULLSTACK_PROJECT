import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import api from '../services/api';
import { format } from 'date-fns';

const AuditTrail = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        { field: 'id', headerName: 'Log ID', width: 90 },
        { 
          field: 'user', 
          headerName: 'User', 
          width: 150,
          valueGetter: (params) => params.value?.username || 'System'
        },
        { field: 'action', headerName: 'Action', flex: 1, minWidth: 400 },
        { 
          field: 'timestamp', 
          headerName: 'Timestamp', 
          width: 220,
          // --- THIS IS THE FIX ---
          valueFormatter: (params) => {
              if (!params.value) return '';
              const date = new Date(params.value);
              if (date instanceof Date && !isNaN(date)) {
                  return format(date, 'PPpp');
              }
              return 'Invalid Date';
          }
        },
    ];

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get('/audit-logs/');
                setLogs(response.data);
            } catch (error) {
                console.error("Failed to fetch audit logs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <Box sx={{ height: 'calc(100vh - 150px)', width: '100%' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>System Audit Trail</Typography>
            <DataGrid
                rows={logs}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                sx={{ backgroundColor: 'background.paper', border: 'none' }}
            />
        </Box>
    );
};

export default AuditTrail;
