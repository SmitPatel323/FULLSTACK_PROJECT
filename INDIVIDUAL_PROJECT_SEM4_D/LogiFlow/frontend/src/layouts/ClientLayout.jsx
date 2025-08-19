import React from 'react';
import { Box } from '@mui/material';
import ClientSidebar from '../components/sidebars/ClientSidebar';
import Header from '../components/Header';

const ClientLayout = ({ children }) => {
  const drawerWidth = 240;
  return (
    <Box sx={{ display: 'flex' }}>
      <ClientSidebar drawerWidth={drawerWidth} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header />
        {children}
      </Box>
    </Box>
  );
};
export default ClientLayout;
