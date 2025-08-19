import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, CircularProgress, Chip, Typography, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import api from '../../services/api';
import FleetFormModal from '../../components/forms/FleetFormModal';

const Fleet = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);

    const fetchFleet = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/fleet/');
            setVehicles(response.data);
        } catch (error) { console.error("Failed to fetch fleet data:", error); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchFleet(); }, [fetchFleet]);

    const handleOpenModal = (vehicle = null) => {
        setEditingVehicle(vehicle);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingVehicle(null);
        setIsModalOpen(false);
    };

    const handleSave = () => {
        handleCloseModal();
        fetchFleet();
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'vehicle_model', headerName: 'Vehicle Model', flex: 1, minWidth: 200 },
        { field: 'license_plate', headerName: 'License Plate', width: 150 },
        { field: 'capacity_kg', headerName: 'Capacity (kg)', type: 'number', width: 150 },
        { field: 'is_available', headerName: 'Availability', width: 150, renderCell: (params) => (
            <Chip label={params.value ? 'Available' : 'In Use'} color={params.value ? 'success' : 'warning'} size="small" />
        )},
        { field: 'actions', headerName: 'Actions', width: 100, sortable: false, renderCell: (params) => (
            <IconButton onClick={() => handleOpenModal(params.row)}><EditIcon /></IconButton>
        )},
    ];

    if (loading) return <CircularProgress />;

    return (
        <>
            <Box sx={{ height: 'calc(100vh - 150px)', width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5">Fleet Management</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
                        Add Vehicle
                    </Button>
                </Box>
                <DataGrid rows={vehicles} columns={columns} sx={{ backgroundColor: 'background.paper', border: 'none' }} />
            </Box>
            <FleetFormModal open={isModalOpen} onClose={handleCloseModal} onSave={handleSave} vehicle={editingVehicle} />
        </>
    );
};
export default Fleet;