import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { Logger } from '../lib';
import { ShortenedURL, URLFormData, ValidationError } from '../types';

// Create a new logger instance instead of using getLogger()
const logger = new Logger({
  apiUrl: 'http://20.244.56.144/evaluation-service/logs',
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyazIyLmNzY3lzLjMyNDI5QGdtYWlsLmNvbSIsImV4cCI6MTc1NzMyMTY1NywiaWF0IjoxNzU3MzIwNzU3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOGJjY2FjMjQtNjZiYS00NDRiLWJlNjEtNGEyZTIxNDcwZDcyIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidHVzaGFyIHNvbmthciIsInN1YiI6IjYwY2NjZGY1LTlhMWItNGI4Yy1iZDc3LTY3ZjFjYzlkODBmMSJ9LCJlbWFpbCI6IjJrMjIuY3NjeXMuMzI0MjlAZ21haWwuY29tIiwibmFtZSI6InR1c2hhciBzb25rYXIiLCJyb2xsTm8iOiIyMjAxNjQxNzIwMTA5IiwiYWNjZXNzQ29kZSI6InNBV1R1UiIsImNsaWVudElEIjoiNjBjY2NkZjUtOWExYi00YjhjLWJkNzctNjdmMWNjOWQ4MGYxIiwiY2xpZW50U2VjcmV0IjoiQVplU0ZucnZOdnpOdnJObiJ9.CAUQm4ewzzRgmkJfAJqZhKM3IWOAJ5byv3IENE3Z2ZI',
  enabled: true
});

const URLShortener: React.FC = () => {
  const [urls, setUrls] = useState<ShortenedURL[]>([]);
  const [forms, setForms] = useState<URLFormData[]>([{ originalUrl: '' }]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    logger.info('component', 'URL Shortener component mounted');
    
    // Load existing URLs from localStorage
    const savedUrls = localStorage.getItem('shortenedUrls');
    if (savedUrls) {
      try {
        const parsedUrls = JSON.parse(savedUrls).map((url: any) => ({
          ...url,
          createdAt: new Date(url.createdAt),
          expiresAt: new Date(url.expiresAt)
        }));
        setUrls(parsedUrls);
        logger.info('state', `Loaded ${parsedUrls.length} URLs from localStorage`);
      } catch (error) {
        logger.error('state', 'Failed to load URLs from localStorage');
      }
    }
  }, []);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateShortCode = (shortCode: string): boolean => {
    return /^[a-zA-Z0-9_-]+$/.test(shortCode) && shortCode.length >= 3 && shortCode.length <= 20;
  };

  const generateShortCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const validateForm = (form: URLFormData, index: number): ValidationError[] => {
    const newErrors: ValidationError[] = [];

    if (!form.originalUrl.trim()) {
      newErrors.push({ field: `url-${index}`, message: 'URL is required' });
    } else if (!validateUrl(form.originalUrl)) {
      newErrors.push({ field: `url-${index}`, message: 'Please enter a valid URL' });
    }

    if (form.customShortCode && !validateShortCode(form.customShortCode)) {
      newErrors.push({ 
        field: `shortcode-${index}`, 
        message: 'Short code must be 3-20 characters, alphanumeric with hyphens/underscores only' 
      });
    }

    if (form.validityMinutes && (form.validityMinutes < 1 || form.validityMinutes > 10080)) {
      newErrors.push({ 
        field: `validity-${index}`, 
        message: 'Validity must be between 1 and 10080 minutes (1 week)' 
      });
    }

    return newErrors;
  };

  const handleInputChange = (index: number, field: keyof URLFormData, value: string | number) => {
    const newForms = [...forms];
    newForms[index] = { ...newForms[index], [field]: value };
    setForms(newForms);

    // Clear errors for this field
    setErrors(errors.filter(error => !error.field.startsWith(`${field}-${index}`)));
    
    logger.debug('component', `Form input changed: ${field} for form ${index}`);
  };

  const addForm = () => {
    if (forms.length < 5) {
      setForms([...forms, { originalUrl: '' }]);
      logger.info('component', `Added new form. Total forms: ${forms.length + 1}`);
    }
  };

  const removeForm = (index: number) => {
    if (forms.length > 1) {
      const newForms = forms.filter((_, i) => i !== index);
      setForms(newForms);
      setErrors(errors.filter(error => !error.field.includes(`-${index}`)));
      logger.info('component', `Removed form ${index}. Total forms: ${newForms.length}`);
    }
  };

  const shortenUrls = async () => {
    setLoading(true);
    setErrors([]);

    logger.info('api', 'Starting URL shortening process');

    // Validate all forms
    let allErrors: ValidationError[] = [];
    forms.forEach((form, index) => {
      const formErrors = validateForm(form, index);
      allErrors = [...allErrors, ...formErrors];
    });

    if (allErrors.length > 0) {
      setErrors(allErrors);
      setLoading(false);
      logger.warn('api', `Validation failed with ${allErrors.length} errors`);
      return;
    }

    try {
      const newUrls: ShortenedURL[] = [];

      for (let i = 0; i < forms.length; i++) {
        const form = forms[i];
        
        // Check for duplicate short codes
        let shortCode = form.customShortCode || generateShortCode();
        let attempts = 0;
        const checkDuplicate = (code: string) => 
          urls.some(url => url.shortCode === code) || newUrls.some(url => url.shortCode === code);
        
        while (checkDuplicate(shortCode)) {
          shortCode = generateShortCode();
          attempts++;
          if (attempts > 10) {
            throw new Error('Unable to generate unique short code');
          }
        }

        const validityMinutes = form.validityMinutes || 30;
        const expiresAt = new Date(Date.now() + validityMinutes * 60 * 1000);
        
        const newUrl: ShortenedURL = {
          id: Date.now().toString() + i,
          originalUrl: form.originalUrl,
          shortCode,
          shortUrl: `${window.location.origin}/${shortCode}`,
          createdAt: new Date(),
          expiresAt,
          clickCount: 0,
          customShortCode: form.customShortCode,
          validityMinutes
        };

        newUrls.push(newUrl);
        logger.info('api', `Created short URL: ${newUrl.shortCode} -> ${newUrl.originalUrl}`);
      }

      const updatedUrls = [...urls, ...newUrls];
      setUrls(updatedUrls);
      localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
      
      // Reset forms
      setForms([{ originalUrl: '' }]);
      
      logger.info('api', `Successfully shortened ${newUrls.length} URLs`);
    } catch (error) {
      logger.error('api', `URL shortening failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    logger.info('component', 'URL copied to clipboard');
  };

  const deleteUrl = (id: string) => {
    const updatedUrls = urls.filter(url => url.id !== id);
    setUrls(updatedUrls);
    localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
    logger.info('state', `Deleted URL with ID: ${id}`);
  };

  const getError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Shorten Your URLs
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Create up to 5 shortened URLs with custom short codes and validity periods.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">URL Forms</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addForm}
              disabled={forms.length >= 5}
            >
              Add URL ({forms.length}/5)
            </Button>
          </Box>

          {forms.map((form, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Original URL"
                    value={form.originalUrl}
                    onChange={(e) => handleInputChange(index, 'originalUrl', e.target.value)}
                    error={!!getError(`url-${index}`)}
                    helperText={getError(`url-${index}`)}
                    placeholder="https://example.com"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Custom Short Code (Optional)"
                    value={form.customShortCode || ''}
                    onChange={(e) => handleInputChange(index, 'customShortCode', e.target.value)}
                    error={!!getError(`shortcode-${index}`)}
                    helperText={getError(`shortcode-${index}`) || '3-20 characters, alphanumeric'}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    label="Validity (minutes)"
                    type="number"
                    value={form.validityMinutes || ''}
                    onChange={(e) => handleInputChange(index, 'validityMinutes', parseInt(e.target.value) || 0)}
                    error={!!getError(`validity-${index}`)}
                    helperText={getError(`validity-${index}`) || 'Default: 30 min'}
                    inputProps={{ min: 1, max: 10080 }}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Tooltip title="Remove this form">
                    <IconButton
                      onClick={() => removeForm(index)}
                      disabled={forms.length === 1}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Button
            variant="contained"
            size="large"
            onClick={shortenUrls}
            disabled={loading || forms.some(form => !form.originalUrl.trim())}
            sx={{ mt: 2 }}
          >
            {loading ? 'Shortening...' : 'Shorten URLs'}
          </Button>
        </CardContent>
      </Card>

      {urls.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Shortened URLs
            </Typography>
            {urls.map((url) => (
              <Paper key={url.id} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {url.originalUrl}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <LinkIcon fontSize="small" />
                      <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                        {url.shortUrl}
                      </Typography>
                      <Tooltip title="Copy URL">
                        <IconButton size="small" onClick={() => copyToClipboard(url.shortUrl)}>
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip
                      label={`${url.clickCount} clicks`}
                      size="small"
                      color="primary"
                    />
                    <Chip
                      icon={<TimeIcon />}
                      label={url.expiresAt.toLocaleString()}
                      size="small"
                      color={url.expiresAt < new Date() ? 'error' : 'default'}
                    />
                    <Tooltip title="Delete URL">
                      <IconButton size="small" onClick={() => deleteUrl(url.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                {url.customShortCode && (
                  <Chip
                    label={`Custom: ${url.customShortCode}`}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                )}
              </Paper>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default URLShortener;
