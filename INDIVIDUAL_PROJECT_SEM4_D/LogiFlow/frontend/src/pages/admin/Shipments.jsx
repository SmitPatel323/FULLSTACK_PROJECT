// import React, { useState, useEffect, useCallback } from 'react';
// import { Box, Button, CircularProgress, Typography } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
// import AddIcon from '@mui/icons-material/Add';
// import { useNavigate } from 'react-router-dom';
// import api from '../../services/api';
// import { format, isValid } from 'date-fns';
// import ShipmentFormModal from '../../components/forms/ShipmentFormModal';

// const Shipments = () => {
//     const [shipments, setShipments] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const navigate = useNavigate();

//     const fetchShipments = useCallback(async () => {
//         setLoading(true);
//         try {
//             const response = await api.get('/shipments/');
//             setShipments(response.data);
//         } catch (error) { console.error("Failed to fetch shipments:", error); }
//         finally { setLoading(false); }
//     }, []);

//     useEffect(() => { fetchShipments(); }, [fetchShipments]);

//     const handleSave = () => {
//         setIsModalOpen(false);
//         fetchShipments();
//     };

//     const columns = [
//         { field: 'id', headerName: 'Shipment ID', width: 120 },
//         // --- THIS IS THE FIX ---
//         // Use optional chaining on `params` as well to prevent crashes
//         // if the entire params object is undefined during a render cycle.
//         { field: 'order_id', headerName: 'Order ID', width: 100, valueGetter: (params) => params?.row?.order?.id || 'N/A' },
//         { field: 'status', headerName: 'Status', width: 120 },
//         { field: 'delivery_agent', headerName: 'Agent', width: 150, valueGetter: (params) => params?.row?.delivery_agent?.username || 'N/A' },
//         { field: 'assigned_vehicle', headerName: 'Vehicle', width: 150, valueGetter: (params) => params?.row?.assigned_vehicle?.license_plate || 'N/A' },
//         { field: 'estimated_delivery_date', headerName: 'Est. Delivery', width: 150, valueFormatter: (params) => {
//             if (!params.value) return '';
//             const date = new Date(params.value);
//             // Correct for timezone display issues with date-only fields
//             return isValid(date) ? format(new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000), 'P') : 'Invalid Date';
//         }},
//     ];

//     if (loading) return <CircularProgress />;

//     return (
//         <>
//             <Box sx={{ height: 'calc(100vh - 150px)', width: '100%', display: 'flex', flexDirection: 'column' }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexShrink: 0 }}>
//                     <Typography variant="h5">Shipment Tracking</Typography>
//                     <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>
//                         Create Shipment
//                     </Button>
//                 </Box>
//                 <Box sx={{ flexGrow: 1 }}>
//                     <DataGrid
//                         rows={shipments}
//                         columns={columns}
//                         onRowClick={(params) => navigate(`/admin/shipments/${params.id}`)}
//                         sx={{ backgroundColor: 'background.paper', border: 'none', '& .MuiDataGrid-row:hover': { cursor: 'pointer' } }}
//                     />
//                 </Box>
//             </Box>
//             <ShipmentFormModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
//         </>
//     );
// };
// export default Shipments;



import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { format, isValid } from 'date-fns';
import ShipmentFormModal from '../../components/forms/ShipmentFormModal';

const Shipments = () => {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchShipments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/shipments/');
            setShipments(response.data);
        } catch (error) { console.error("Failed to fetch shipments:", error); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchShipments(); }, [fetchShipments]);

    const handleSave = (newShipment) => {
        setIsModalOpen(false);
        setShipments(prevShipments => [newShipment, ...prevShipments]);
    };

    const columns = [
        { field: 'id', headerName: 'Shipment ID', width: 120 },
        // --- THIS IS THE FIX ---
        // Use optional chaining on `params` as well to prevent crashes
        // if the entire params object is undefined during a render cycle.
        { field: 'order_id', headerName: 'Order ID', width: 100, valueGetter: (params) => params?.row?.order?.id || 'N/A' },
        { field: 'status', headerName: 'Status', width: 120 },
        { field: 'delivery_agent', headerName: 'Agent', width: 150, valueGetter: (params) => params?.row?.delivery_agent?.username || 'N/A' },
        { field: 'assigned_vehicle', headerName: 'Vehicle', width: 150, valueGetter: (params) => params?.row?.assigned_vehicle?.license_plate || 'N/A' },
        { field: 'estimated_delivery_date', headerName: 'Est. Delivery', width: 150, valueFormatter: (params) => {
            if (!params.value) return '';
            const date = new Date(params.value);
            // Correct for timezone display issues with date-only fields
            return isValid(date) ? format(new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000), 'P') : 'Invalid Date';
        }},
    ];

    if (loading) return <CircularProgress />;

    return (
        <>
            <Box sx={{ height: 'calc(100vh - 150px)', width: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexShrink: 0 }}>
                    <Typography variant="h5">Shipment Tracking</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>
                        Create Shipment
                    </Button>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    <DataGrid
                        rows={shipments}
                        columns={columns}
                        onRowClick={(params) => navigate(`/admin/shipments/${params.id}`)}
                        sx={{ backgroundColor: 'background.paper', border: 'none', '& .MuiDataGrid-row:hover': { cursor: 'pointer' } }}
                    />
                </Box>
            </Box>
            <ShipmentFormModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
        </>
    );
};
export default Shipments;


