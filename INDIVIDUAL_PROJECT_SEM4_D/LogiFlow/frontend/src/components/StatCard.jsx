import React from 'react';
import { Card, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon }) => {
  return (
    <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
      <Card sx={{ display: 'flex', alignItems: 'center', p: 2.5, height: '100%' }}>
        <Box sx={{ mr: 2, p: 2, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'primary.main', color: '#fff', boxShadow: '0 4px 20px 0 rgba(0,150,255,0.4)' }}>
          {icon}
        </Box>
        <Box>
          <Typography color="text.secondary" gutterBottom>{title}</Typography>
          <Typography variant="h5" component="div" fontWeight="700">{value}</Typography>
        </Box>
      </Card>
    </motion.div>
  );
};
export default StatCard;