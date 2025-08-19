import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, CircularProgress, Alert, Typography, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import api from '../../services/api';
import ProductFormModal from '../../components/forms/ProductFormModal';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/products/');
            setProducts(response.data);
        } catch (err) {
            console.error("Failed to fetch products:", err);
            setError('Failed to load inventory.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const handleOpenModal = (product = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingProduct(null);
        setIsModalOpen(false);
    };

    const handleSaveProduct = () => {
        handleCloseModal();
        fetchProducts();
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Product Name', flex: 1, minWidth: 250 },
        { field: 'sku', headerName: 'SKU', width: 150 },
        { field: 'quantity', headerName: 'Quantity', type: 'number', width: 130 },
        { field: 'warehouse_location', headerName: 'Location', width: 180 },
        { field: 'actions', headerName: 'Actions', width: 100, sortable: false, renderCell: (params) => (
            <IconButton onClick={() => handleOpenModal(params.row)}><EditIcon /></IconButton>
        )},
    ];

    if (loading) return <CircularProgress />;

    return (
        <>
            <Box sx={{ height: 'calc(100vh - 150px)', width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5">Product Inventory</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
                        Add Product
                    </Button>
                </Box>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <DataGrid rows={products} columns={columns} sx={{ backgroundColor: 'background.paper', border: 'none' }} />
            </Box>
            <ProductFormModal open={isModalOpen} onClose={handleCloseModal} onSave={handleSaveProduct} product={editingProduct} />
        </>
    );
};
export default Inventory;