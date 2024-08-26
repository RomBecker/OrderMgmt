import React from 'react';
import { Typography, Box } from '@mui/material';

function Dashboard() {
  return (
    <Box sx={{ my: 4, direction: 'rtl' }}>
      <Typography variant="h4" align="center" gutterBottom color="primary">
      ניהול הזמנות עבר והווה
      </Typography>
      <Typography variant="body1" align="center">
      קומפוננטת ניהול הזמנות עבר והווה
      </Typography>
    </Box>
  );
}

export default Dashboard;
