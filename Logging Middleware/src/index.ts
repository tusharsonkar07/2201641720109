// Main export file for the AFFORDMED Logging Middleware

export { Logger, initializeLogger, getLogger, log } from './logger';
export type { 
  Stack, 
  Level, 
  Package, 
  LogRequest, 
  LogResponse, 
  LoggerConfig 
} from './types';

// Re-export everything for convenience
export * from './logger';
export * from './types';
