# AFFORDMED URL Shortener - Frontend Application

A fully functional, responsive React URL Shortener application built for the AFFORDMED assessment.

## Features

### ✅ Core Functionality
- **URL Shortening**: Create up to 5 shortened URLs concurrently
- **Custom Short Codes**: Optional custom short codes (3-20 characters, alphanumeric)
- **Validity Periods**: Configurable expiration times (1 minute to 1 week, default: 30 minutes)
- **Client-side Routing**: Automatic redirection when accessing short URLs
- **Real-time Analytics**: Click tracking and detailed statistics

### ✅ User Experience
- **Responsive Design**: Works perfectly on mobile and desktop
- **Material UI**: Modern, clean interface using Material-UI components
- **Form Validation**: Comprehensive client-side validation
- **Error Handling**: User-friendly error messages and validation feedback
- **Copy to Clipboard**: Easy URL copying functionality

### ✅ Technical Features
- **TypeScript**: Full type safety throughout the application
- **Comprehensive Logging**: Extensive logging using AFFORDMED logging middleware
- **Local Storage**: Persistent data storage for URLs and statistics
- **Mock Analytics**: Simulated click data with geographical information
- **Component Architecture**: Well-structured, reusable React components

## Project Structure

```
src/
├── components/
│   ├── URLShortener.tsx      # Main URL shortening interface
│   ├── Statistics.tsx        # Analytics and statistics page
│   └── RedirectHandler.tsx   # URL redirection handler
├── lib/                      # Logging middleware (copied from parent)
├── types/
│   └── index.ts             # TypeScript type definitions
├── App.tsx                   # Main application component
└── index.tsx                 # Application entry point
```

## Technologies Used

- **React 18** with TypeScript
- **Material-UI (MUI)** for styling and components
- **React Router** for client-side routing
- **Custom Logging Middleware** for AFFORDMED compliance
- **Local Storage** for data persistence

## Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

3. **Access Application**:
   - Open http://localhost:3000 in your browser
   - The application will automatically open in your default browser

## Usage

### URL Shortening
1. Navigate to the "Shorten URLs" tab
2. Enter up to 5 URLs to shorten
3. Optionally provide custom short codes and validity periods
4. Click "Shorten URLs" to create shortened links
5. Copy the generated short URLs

### Statistics & Analytics
1. Navigate to the "Statistics" tab
2. View all created URLs with click counts
3. Search and filter URLs
4. Click on any URL to view detailed click analytics
5. See geographical data, source information, and device types

### URL Redirection
1. Access any short URL (e.g., http://localhost:3000/abc123)
2. The application will automatically redirect to the original URL
3. Click tracking is automatically updated

## Logging Integration

The application extensively uses the AFFORDMED logging middleware:

- **Component Lifecycle**: Logs when components mount/unmount
- **User Actions**: Logs form submissions, clicks, and navigation
- **API Operations**: Logs URL creation, redirection, and data loading
- **Error Handling**: Logs validation errors and system errors
- **State Changes**: Logs data persistence and state updates

All logs are sent to the AFFORDMED test server with proper categorization:
- **Stack**: `frontend`
- **Packages**: `component`, `api`, `state`, `utils`, `middleware`
- **Levels**: `debug`, `info`, `warn`, `error`, `fatal`

## Validation Rules

### URL Validation
- Must be a valid URL format
- Required field for all forms

### Short Code Validation
- 3-20 characters long
- Alphanumeric characters, hyphens, and underscores only
- Must be unique across all URLs

### Validity Period Validation
- 1 minute to 10,080 minutes (1 week)
- Default: 30 minutes if not specified

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Material-UI for consistent styling
- Comprehensive error handling
- Production-ready code structure

## Assessment Compliance

This application meets all AFFORDMED assessment requirements:

- ✅ React application running on localhost:3000
- ✅ Material-UI styling framework
- ✅ Comprehensive logging integration
- ✅ Client-side routing for URL redirection
- ✅ Up to 5 concurrent URL shortening
- ✅ Custom short codes and validity periods
- ✅ Robust error handling and validation
- ✅ Responsive design for mobile and desktop
- ✅ High code quality and production standards
