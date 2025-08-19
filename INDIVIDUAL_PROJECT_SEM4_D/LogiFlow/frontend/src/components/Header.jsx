import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import ProfileMenu from './ProfileMenu';

const Header = ({ drawerWidth }) => {
  return (
    <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, backgroundColor: 'background.paper', boxShadow: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          LogiFlow Client Portal
        </Typography>
        <ProfileMenu />
      </Toolbar>
    </AppBar>
  );
};
export default Header;