import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Link
} from '@mui/material';
import { Logger } from '../lib';
import { ShortenedURL } from '../types';

// Create a new logger instance instead of using getLogger()
const logger = new Logger({
  apiUrl: 'http://20.244.56.144/evaluation-service/logs',
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyazIyLmNzY3lzLjMyNDI5QGdtYWlsLmNvbSIsImV4cCI6MTc1NzMyMTY1NywiaWF0IjoxNzU3MzIwNzU3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOGJjY2FjMjQtNjZiYS00NDRiLWJlNjEtNGEyZTIxNDcwZDcyIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidHVzaGFyIHNvbmthciIsInN1YiI6IjYwY2NjZGY1LTlhMWItNGI4Yy1iZDc3LTY3ZjFjYzlkODBmMSJ9LCJlbWFpbCI6IjJrMjIuY3NjeXMuMzI0MjlAZ21haWwuY29tIiwibmFtZSI6InR1c2hhciBzb25rYXIiLCJyb2xsTm8iOiIyMjAxNjQxNzIwMTA5IiwiYWNjZXNzQ29kZSI6InNBV1R1UiIsImNsaWVudElEIjoiNjBjY2NkZjUtOWExYi00YjhjLWJkNzctNjdmMWNjOWQ4MGYxIiwiY2xpZW50U2VjcmV0IjoiQVplU0ZucnZOdnpOdnJObiJ9.CAUQm4ewzzRgmkJfAJqZhKM3IWOAJ5byv3IENE3Z2ZI',
  enabled: true
});

const RedirectHandler: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const [url, setUrl] = useState<ShortenedURL | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shortCode) {
      setError('No short code provided');
      setLoading(false);
      return;
    }

    logger.info('component', `Redirect handler activated for short code: ${shortCode}`);

    // Load URLs from localStorage
    const savedUrls = localStorage.getItem('shortenedUrls');
    if (!savedUrls) {
      setError('No URLs found');
      setLoading(false);
      logger.warn('api', 'No URLs found in localStorage');
      return;
    }

    try {
      const urls: ShortenedURL[] = JSON.parse(savedUrls).map((url: any) => ({
        ...url,
        createdAt: new Date(url.createdAt),
        expiresAt: new Date(url.expiresAt)
      }));

      const foundUrl = urls.find(u => u.shortCode === shortCode);
      
      if (!foundUrl) {
        setError('Short URL not found');
        setLoading(false);
        logger.warn('api', `Short URL not found: ${shortCode}`);
        return;
      }

      if (foundUrl.expiresAt < new Date()) {
        setError('This short URL has expired');
        setLoading(false);
        logger.warn('api', `Short URL expired: ${shortCode}`);
        return;
      }

      setUrl(foundUrl);
      logger.info('api', `Found valid short URL: ${shortCode} -> ${foundUrl.originalUrl}`);

      // Simulate click tracking
      const updatedUrls = urls.map(u => 
        u.id === foundUrl.id 
          ? { ...u, clickCount: u.clickCount + 1 }
          : u
      );
      localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
      
      logger.info('api', `Click tracked for short code: ${shortCode}`);

      // Redirect after a short delay
      setTimeout(() => {
        logger.info('api', `Redirecting to: ${foundUrl.originalUrl}`);
        window.location.href = foundUrl.originalUrl;
      }, 2000);

    } catch (error) {
      setError('Failed to load URL data');
      setLoading(false);
      logger.error('api', `Failed to load URL data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [shortCode, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <CardContent>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6">
              Redirecting...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we redirect you to your destination.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Card sx={{ p: 4, textAlign: 'center', maxWidth: 500 }}>
          <CardContent>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Typography variant="h6" gutterBottom>
              Unable to redirect
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              The short URL you're looking for either doesn't exist or has expired.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/shorten')}
              sx={{ mt: 2 }}
            >
              Create New Short URL
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (url) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Card sx={{ p: 4, textAlign: 'center', maxWidth: 600 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Redirecting to your destination...
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              You will be redirected to:
            </Typography>
            <Link
              href={url.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                wordBreak: 'break-all',
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              {url.originalUrl}
            </Link>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              If you are not redirected automatically, click the link above.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              This URL has been clicked {url.clickCount} times
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return null;
};

export default RedirectHandler;
