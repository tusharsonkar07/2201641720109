# AFFORDMED Logging Middleware

A reusable TypeScript logging package for the AFFORDMED assessment project.

## Features

- ✅ Type-safe logging with TypeScript
- ✅ Validates inputs according to AFFORDMED requirements
- ✅ Convenience methods for different log levels
- ✅ Error handling that won't break your application
- ✅ Configurable timeout and enable/disable functionality
- ✅ Works with both frontend and backend applications

## Installation

```bash
npm install
npm run build
```

## Usage

### Basic Setup

```typescript
import { initializeLogger, Logger } from './dist';

// Initialize the logger
const logger = initializeLogger({
  apiUrl: 'http://20.244.56.144/evaluation-service/logs',
  accessToken: 'your-access-token-here',
  enabled: true,
  timeout: 5000
});
```

### Logging Messages

```typescript
// Using the Logger class directly
await logger.log('frontend', 'info', 'component', 'User clicked login button');
await logger.log('frontend', 'error', 'api', 'Failed to fetch user data: Network timeout');

// Using convenience methods
await logger.info('component', 'Component mounted successfully');
await logger.error('api', 'API request failed with status 500');
await logger.warn('state', 'State update may cause performance issues');
```

### Using the Global Logger

```typescript
import { log, initializeLogger } from './dist';

// Initialize once
initializeLogger({
  apiUrl: 'http://20.244.56.144/evaluation-service/logs',
  accessToken: 'your-access-token-here',
  enabled: true
});

// Use anywhere in your app
await log('frontend', 'debug', 'utils', 'Utility function executed successfully');
```

## Valid Values

### Stack
- `backend`
- `frontend`

### Level
- `debug`
- `info`
- `warn`
- `error`
- `fatal`

### Package (Frontend)
- `api`
- `component`
- `hook`
- `page`
- `state`
- `style`
- `auth` (shared)
- `config` (shared)
- `middleware` (shared)
- `utils` (shared)

## Error Handling

The logger is designed to never break your application. If logging fails:
- Errors are logged to the console
- The original error is not thrown
- Your application continues running normally

## Configuration

```typescript
interface LoggerConfig {
  apiUrl: string;           // Required: API endpoint URL
  accessToken: string;      // Required: Bearer token for authentication
  enabled: boolean;         // Required: Enable/disable logging
  timeout?: number;         // Optional: Request timeout in ms (default: 5000)
}
```

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Watch mode for development
npm run dev

# Test the package
npm test
```
