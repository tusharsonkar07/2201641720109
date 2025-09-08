import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Grid,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ContentCopy as CopyIcon,
  Link as LinkIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Computer as ComputerIcon,
  Smartphone as MobileIcon
} from '@mui/icons-material';
import { Logger } from '../lib';
import { ShortenedURL, ClickData } from '../types';

// Create a new logger instance instead of using getLogger()
const logger = new Logger({
  apiUrl: 'http://20.244.56.144/evaluation-service/logs',
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyazIyLmNzY3lzLjMyNDI5QGdtYWlsLmNvbSIsImV4cCI6MTc1NzMyMTY1NywiaWF0IjoxNzU3MzIwNzU3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOGJjY2FjMjQtNjZiYS00NDRiLWJlNjEtNGEyZTIxNDcwZDcyIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidHVzaGFyIHNvbmthciIsInN1YiI6IjYwY2NjZGY1LTlhMWItNGI4Yy1iZDc3LTY3ZjFjYzlkODBmMSJ9LCJlbWFpbCI6IjJrMjIuY3NjeXMuMzI0MjlAZ21haWwuY29tIiwibmFtZSI6InR1c2hhciBzb25rYXIiLCJyb2xsTm8iOiIyMjAxNjQxNzIwMTA5IiwiYWNjZXNzQ29kZSI6InNBV1R1UiIsImNsaWVudElEIjoiNjBjY2NkZjUtOWExYi00YjhjLWJkNzctNjdmMWNjOWQ4MGYxIiwiY2xpZW50U2VjcmV0IjoiQVplU0ZucnZOdnpOdnJObiJ9.CAUQm4ewzzRgmkJfAJqZhKM3IWOAJ5byv3IENE3Z2ZI',
  enabled: true
});

const Statistics: React.FC = () => {
  const [urls, setUrls] = useState<ShortenedURL[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUrl, setSelectedUrl] = useState<ShortenedURL | null>(null);
  const [clickData, setClickData] = useState<ClickData[]>([]);

  useEffect(() => {
    logger.info('component', 'Statistics component mounted');
    
    // Load URLs from localStorage
    const savedUrls = localStorage.getItem('shortenedUrls');
    if (savedUrls) {
      try {
        const parsedUrls = JSON.parse(savedUrls).map((url: any) => ({
          ...url,
          createdAt: new Date(url.createdAt),
          expiresAt: new Date(url.expiresAt)
        }));
        setUrls(parsedUrls);
        logger.info('state', `Loaded ${parsedUrls.length} URLs for statistics`);
      } catch (error) {
        logger.error('state', 'Failed to load URLs from localStorage');
      }
    }
  }, []);

  const generateMockClickData = (shortCode: string): ClickData[] => {
    const mockData: ClickData[] = [];
    const sources = ['Direct', 'Google', 'Facebook', 'Twitter', 'Email', 'Other'];
    const locations = ['New York, US', 'London, UK', 'Tokyo, Japan', 'Mumbai, India', 'Sydney, Australia', 'Berlin, Germany'];
    const userAgents = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Mobile Chrome', 'Mobile Safari'];
    
    const clickCount = Math.floor(Math.random() * 50) + 1;
    
    for (let i = 0; i < clickCount; i++) {
      const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Random time in last 7 days
      mockData.push({
        id: `${shortCode}-${i}`,
        shortCode,
        timestamp,
        source: sources[Math.floor(Math.random() * sources.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        userAgent: userAgents[Math.floor(Math.random() * userAgents.length)]
      });
    }
    
    return mockData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const handleUrlClick = (url: ShortenedURL) => {
    setSelectedUrl(url);
    const mockClicks = generateMockClickData(url.shortCode);
    setClickData(mockClicks);
    logger.info('component', `Selected URL for detailed stats: ${url.shortCode}`);
  };

  const filteredUrls = urls.filter(url =>
    url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (url.customShortCode && url.customShortCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    logger.info('component', 'URL copied to clipboard');
  };

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'google':
        return '🔍';
      case 'facebook':
        return '📘';
      case 'twitter':
        return '🐦';
      case 'email':
        return '📧';
      case 'direct':
        return '🔗';
      default:
        return '🌐';
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    return userAgent.toLowerCase().includes('mobile') ? <MobileIcon /> : <ComputerIcon />;
  };

  const totalClicks = urls.reduce((sum, url) => sum + url.clickCount, 0);
  const activeUrls = urls.filter(url => url.expiresAt > new Date()).length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        URL Statistics
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total URLs
              </Typography>
              <Typography variant="h4">
                {urls.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Clicks
              </Typography>
              <Typography variant="h4">
                {totalClicks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active URLs
              </Typography>
              <Typography variant="h4">
                {activeUrls}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search URLs by original URL, short code, or custom short code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* URLs Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All Shortened URLs
          </Typography>
          
          {filteredUrls.length === 0 ? (
            <Alert severity="info">
              {searchTerm ? 'No URLs match your search criteria.' : 'No URLs have been created yet.'}
            </Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Original URL</TableCell>
                    <TableCell>Short Code</TableCell>
                    <TableCell>Short URL</TableCell>
                    <TableCell>Clicks</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Expires</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUrls.map((url) => (
                    <TableRow key={url.id} hover>
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {url.originalUrl}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {url.shortCode}
                        </Typography>
                        {url.customShortCode && (
                          <Chip label="Custom" size="small" color="primary" sx={{ ml: 1 }} />
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {url.shortUrl}
                          </Typography>
                          <Tooltip title="Copy URL">
                            <IconButton size="small" onClick={() => copyToClipboard(url.shortUrl)}>
                              <CopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={url.clickCount}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {url.createdAt.toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {url.createdAt.toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TimeIcon fontSize="small" />
                          <Typography variant="body2">
                            {url.expiresAt.toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {url.expiresAt.toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={url.expiresAt > new Date() ? 'Active' : 'Expired'}
                          color={url.expiresAt > new Date() ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View detailed statistics">
                          <IconButton
                            size="small"
                            onClick={() => handleUrlClick(url)}
                          >
                            <LinkIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Detailed Click Statistics */}
      {selectedUrl && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Detailed Statistics for: {selectedUrl.shortCode}
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Original URL: {selectedUrl.originalUrl}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Short URL: {selectedUrl.shortUrl}
                </Typography>
              </Grid>
            </Grid>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Click Details ({clickData.length} clicks)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {clickData.map((click, index) => (
                    <React.Fragment key={click.id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getSourceIcon(click.source)}
                              <Typography variant="body2">
                                {click.source}
                              </Typography>
                              <Chip
                                icon={<LocationIcon />}
                                label={click.location}
                                size="small"
                                variant="outlined"
                              />
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {getDeviceIcon(click.userAgent)}
                                <Typography variant="caption">
                                  {click.userAgent}
                                </Typography>
                              </Box>
                            </Box>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {click.timestamp.toLocaleString()}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < clickData.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Statistics;
