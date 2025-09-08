import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Tabs, Tab, Box } from '@mui/material';
import { Logger } from './lib';
import URLShortener from './components/URLShortener';
import Statistics from './components/Statistics';
import RedirectHandler from './components/RedirectHandler';

// Initialize logging middleware
const logger = new Logger({
  apiUrl: 'http://20.244.56.144/evaluation-service/logs',
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyazIyLmNzY3lzLjMyNDI5QGdtYWlsLmNvbSIsImV4cCI6MTc1NzMyMTY1NywiaWF0IjoxNzU3MzIwNzU3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOGJjY2FjMjQtNjZiYS00NDRiLWJlNjEtNGEyZTIxNDcwZDcyIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidHVzaGFyIHNvbmthciIsInN1YiI6IjYwY2NjZGY1LTlhMWItNGI4Yy1iZDc3LTY3ZjFjYzlkODBmMSJ9LCJlbWFpbCI6IjJrMjIuY3NjeXMuMzI0MjlAZ21haWwuY29tIiwibmFtZSI6InR1c2hhciBzb25rYXIiLCJyb2xsTm8iOiIyMjAxNjQxNzIwMTA5IiwiYWNjZXNzQ29kZSI6InNBV1R1UiIsImNsaWVudElEIjoiNjBjY2NkZjUtOWExYi00YjhjLWJkNzctNjdmMWNjOWQ4MGYxIiwiY2xpZW50U2VjcmV0IjoiQVplU0ZucnZOdnpOdnJObiJ9.CAUQm4ewzzRgmkJfAJqZhKM3IWOAJ5byv3IENE3Z2ZI',
  enabled: true
});

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Log application initialization
    logger.info('component', 'URL Shortener application initialized');
  }, []);

  useEffect(() => {
    // Update tab based on current route
    if (location.pathname === '/shorten') {
      setCurrentTab(0);
    } else if (location.pathname === '/statistics') {
      setCurrentTab(1);
    }
  }, [location]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    if (newValue === 0) {
      navigate('/shorten');
    } else {
      navigate('/statistics');
    }
    logger.info('component', `Navigation tab changed to ${newValue === 0 ? 'URL Shortener' : 'Statistics'}`);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="navigation tabs">
            <Tab label="Shorten URLs" />
            <Tab label="Statistics" />
          </Tabs>
        </Box>

        <Routes>
          <Route path="/" element={<Navigate to="/shorten" replace />} />
          <Route path="/shorten" element={<URLShortener />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/:shortCode" element={<RedirectHandler />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
