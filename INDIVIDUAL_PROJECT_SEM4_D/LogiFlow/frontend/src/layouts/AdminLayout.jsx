import React from 'react';
import { Box } from '@mui/material';
import AdminSidebar from '../components/sidebars/AdminSidebar';
import Header from '../components/Header';

const AdminLayout = ({ children }) => {
  const drawerWidth = 240;
  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar drawerWidth={drawerWidth} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header />
        {children}
      </Box>
    </Box>
  );
};
export default AdminLayout;