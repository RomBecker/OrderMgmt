import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, CssBaseline, ThemeProvider, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';

import Dashboard from './Dashboard';
import OrderForm from './OrderForm';

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#00b6f5', // Updated to the requested color
    },
  },
});

const NavButton = ({ to, icon, text }) => (
  <Button
    component={Link}
    to={to}
    variant="contained"
    color="secondary"
    sx={{
      fontWeight: 'bold',
      borderRadius: '20px',
      padding: '8px 16px',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: 'white', // Ensuring text color is white
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        backgroundColor: '#00a0d9', // Slightly darker shade for hover effect
      },
    }}
  >
    {icon}
    <span>{text}</span>
  </Button>
);

function App() {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppBar position="static">
            <Toolbar sx={{ justifyContent: 'space-between', padding: '0 16px' }}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
                מערכת ניהול רכש
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <NavButton to="/" icon={<DashboardIcon />} text="ניהול הזמנות" />
                <NavButton to="/new-order" icon={<AddCircleOutlineIcon />} text="הזמנה חדשה" />
              </Box>
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/new-order" element={<OrderForm />} />
            </Routes>
          </Container>
        </Router>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;