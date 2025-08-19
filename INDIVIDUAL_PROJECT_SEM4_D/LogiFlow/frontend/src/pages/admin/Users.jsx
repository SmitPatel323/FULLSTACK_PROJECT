import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, CircularProgress, Typography, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import api from '../../services/api';
import UserFormModal from '../../components/forms/UserFormModal';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/users/');
            setUsers(response.data);
        } catch (error) { console.error("Failed to fetch users:", error); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleOpenModal = (user = null) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingUser(null);
        setIsModalOpen(false);
    };

    const handleSave = () => {
        handleCloseModal();
        fetchUsers();
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'username', headerName: 'Username', flex: 1, minWidth: 150 },
        { field: 'first_name', headerName: 'First Name', width: 150 },
        { field: 'last_name', headerName: 'Last Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'role', headerName: 'Role', width: 150 },
        { field: 'actions', headerName: 'Actions', width: 100, sortable: false, renderCell: (params) => (
            <IconButton onClick={() => handleOpenModal(params.row)}><EditIcon /></IconButton>
        )},
    ];

    if (loading) return <CircularProgress />;

    return (
        <>
            <Box sx={{ height: 'calc(100vh - 150px)', width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5">User Management</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
                        Add User
                    </Button>
                </Box>
                <DataGrid rows={users} columns={columns} sx={{ backgroundColor: 'background.paper', border: 'none' }} />
            </Box>
            <UserFormModal open={isModalOpen} onClose={handleCloseModal} onSave={handleSave} user={editingUser} />
        </>
    );
};
export default Users;