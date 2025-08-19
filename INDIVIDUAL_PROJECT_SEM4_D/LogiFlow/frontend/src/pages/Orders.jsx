// import React, { useState, useEffect } from 'react';
// import { Box, Button, CircularProgress, Typography } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
// import AddIcon from '@mui/icons-material/Add';
// import api from '../services/api';
// import { format } from 'date-fns';

// const columns = [
//     { field: 'id', headerName: 'Order ID', width: 100 },
//     { field: 'customer_name', headerName: 'Customer', width: 200 },
//     { field: 'status', headerName: 'Status', width: 120 },
//     { 
//       field: 'items', 
//       headerName: 'Items', 
//       width: 300,
//       renderCell: (params) => (
//         <Typography variant="body2" noWrap>
//           {params.value.map(item => `${item.quantity}x ${item.product_name}`).join(', ')}
//         </Typography>
//       )
//     },
//     { 
//       field: 'created_at', 
//       headerName: 'Date Created', 
//       width: 180,
//       valueFormatter: (params) => format(new Date(params.value), 'PPpp')
//     },
// ];

// const Orders = () => {
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 const response = await api.get('/orders/');
//                 setOrders(response.data);
//             } catch (error) {
//                 console.error("Failed to fetch orders:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchOrders();
//     }, []);

//     if (loading) return <CircularProgress />;

//     return (
//         <Box sx={{ height: 650, width: '100%' }}>
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
//                 <Button variant="contained" startIcon={<AddIcon />}>
//                     Create Order
//                 </Button>
//             </Box>
//             <DataGrid
//                 rows={orders}
//                 columns={columns}
//                 pageSize={10}
//                 rowsPerPageOptions={[10]}
//                 checkboxSelection
//                 disableSelectionOnClick
//                 sx={{ backgroundColor: 'background.paper' }}
//             />
//         </Box>
//     );
// };

// export default Orders;



import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import api from '../services/api';
import { format } from 'date-fns';
import OrderFormModal from '../components/forms/OrderFormModal';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/orders/');
            setOrders(response.data);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
    
    const handleSave = () => {
        setIsModalOpen(false);
        fetchOrders();
    };

    const columns = [
        { field: 'id', headerName: 'Order ID', width: 100 },
        { field: 'customer_name', headerName: 'Customer', width: 200 },
        { field: 'status', headerName: 'Status', width: 120 },
        { 
          field: 'items', 
          headerName: 'Items', 
          width: 300,
          flex: 1,
          renderCell: (params) => (
            <Typography variant="body2" noWrap>
              {params.value.map(item => `${item.quantity}x ${item.product_name}`).join(', ')}
            </Typography>
          )
        },
        { 
          field: 'created_at', 
          headerName: 'Date Created', 
          width: 180,
          // --- THIS IS THE FIX ---
          // Make the formatter robust to handle null or invalid dates
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

    if (loading) return <CircularProgress />;

    return (
        <>
            <Box sx={{ height: 'calc(100vh - 150px)', width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5">Customer Orders</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>
                        Create Order
                    </Button>
                </Box>
                <DataGrid
                    rows={orders}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    disableSelectionOnClick
                    sx={{ backgroundColor: 'background.paper', border: 'none' }}
                />
            </Box>
            <OrderFormModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
        </>
    );
};

export default Orders;