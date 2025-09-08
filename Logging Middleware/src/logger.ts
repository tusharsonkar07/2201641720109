import axios, { AxiosResponse } from 'axios';
import { LogRequest, LogResponse, LoggerConfig, Stack, Level, Package } from './types';

/**
 * AFFORDMED Logging Middleware
 * Reusable logging package for capturing application events
 */
export class Logger {
  private config: LoggerConfig;
  private isEnabled: boolean;

  constructor(config: LoggerConfig) {
    this.config = {
      timeout: 5000, // 5 second timeout
      ...config
    };
    this.isEnabled = config.enabled;
  }

  /**
   * Log a message to the AFFORDMED test server
   * @param stack - 'backend' or 'frontend'
   * @param level - 'debug', 'info', 'warn', 'error', or 'fatal'
   * @param packageName - The package/module name
   * @param message - Descriptive message about what's happening
   */
  public async log(
    stack: Stack,
    level: Level,
    packageName: Package,
    message: string
  ): Promise<LogResponse | null> {
    // Early return if logging is disabled
    if (!this.isEnabled) {
      console.log(`[LOGGING DISABLED] ${stack.toUpperCase()} | ${level.toUpperCase()} | ${packageName} | ${message}`);
      return null;
    }

    // Validate inputs
    if (!this.validateInputs(stack, level, packageName, message)) {
      console.error('Invalid logging parameters provided');
      return null;
    }

    const logRequest: LogRequest = {
      stack: stack.toLowerCase() as Stack,
      level: level.toLowerCase() as Level,
      package: packageName.toLowerCase() as Package,
      message: message.trim()
    };

    try {
      const response: AxiosResponse<LogResponse> = await axios.post(
        this.config.apiUrl,
        logRequest,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.accessToken}`
          },
          timeout: this.config.timeout
        }
      );

      // Log success to console for debugging
      console.log(`✅ Log sent successfully: ${response.data.logID}`);
      
      return response.data;
    } catch (error) {
      // Log error to console but don't throw - logging should not break the app
      console.error('❌ Failed to send log:', error instanceof Error ? error.message : 'Unknown error');
      console.error('Log data that failed:', logRequest);
      return null;
    }
  }

  /**
   * Convenience method for debug logs
   */
  public async debug(packageName: Package, message: string): Promise<LogResponse | null> {
    return this.log('frontend', 'debug', packageName, message);
  }

  /**
   * Convenience method for info logs
   */
  public async info(packageName: Package, message: string): Promise<LogResponse | null> {
    return this.log('frontend', 'info', packageName, message);
  }

  /**
   * Convenience method for warning logs
   */
  public async warn(packageName: Package, message: string): Promise<LogResponse | null> {
    return this.log('frontend', 'warn', packageName, message);
  }

  /**
   * Convenience method for error logs
   */
  public async error(packageName: Package, message: string): Promise<LogResponse | null> {
    return this.log('frontend', 'error', packageName, message);
  }

  /**
   * Convenience method for fatal logs
   */
  public async fatal(packageName: Package, message: string): Promise<LogResponse | null> {
    return this.log('frontend', 'fatal', packageName, message);
  }

  /**
   * Enable or disable logging
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Update the access token
   */
  public updateToken(token: string): void {
    this.config.accessToken = token;
  }

  /**
   * Validate logging inputs according to AFFORDMED requirements
   */
  private validateInputs(stack: string, level: string, packageName: string, message: string): boolean {
    // Validate stack
    if (!['backend', 'frontend'].includes(stack.toLowerCase())) {
      console.error(`Invalid stack: ${stack}. Must be 'backend' or 'frontend'`);
      return false;
    }

    // Validate level
    if (!['debug', 'info', 'warn', 'error', 'fatal'].includes(level.toLowerCase())) {
      console.error(`Invalid level: ${level}. Must be 'debug', 'info', 'warn', 'error', or 'fatal'`);
      return false;
    }

    // Validate package based on stack
    const validBackendPackages = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'];
    const validFrontendPackages = ['api', 'component', 'hook', 'page', 'state', 'style'];
    const validSharedPackages = ['auth', 'config', 'middleware', 'utils'];
    
    const allValidPackages = [...validBackendPackages, ...validFrontendPackages, ...validSharedPackages];
    
    if (!allValidPackages.includes(packageName.toLowerCase())) {
      console.error(`Invalid package: ${packageName}. Must be one of: ${allValidPackages.join(', ')}`);
      return false;
    }

    // Check if package is valid for the given stack
    if (stack.toLowerCase() === 'frontend') {
      const validForFrontend = [...validFrontendPackages, ...validSharedPackages];
      if (!validForFrontend.includes(packageName.toLowerCase())) {
        console.error(`Package '${packageName}' is not valid for frontend stack`);
        return false;
      }
    }

    if (stack.toLowerCase() === 'backend') {
      const validForBackend = [...validBackendPackages, ...validSharedPackages];
      if (!validForBackend.includes(packageName.toLowerCase())) {
        console.error(`Package '${packageName}' is not valid for backend stack`);
        return false;
      }
    }

    // Validate message
    if (!message || message.trim().length === 0) {
      console.error('Message cannot be empty');
      return false;
    }

    return true;
  }
}

// Create a default logger instance
let defaultLogger: Logger | null = null;

/**
 * Initialize the default logger
 */
export function initializeLogger(config: LoggerConfig): Logger {
  defaultLogger = new Logger(config);
  return defaultLogger;
}

/**
 * Get the default logger instance
 */
export function getLogger(): Logger {
  if (!defaultLogger) {
    throw new Error('Logger not initialized. Call initializeLogger() first.');
  }
  return defaultLogger;
}

/**
 * Convenience function for logging (uses default logger)
 */
export async function log(
  stack: Stack,
  level: Level,
  packageName: Package,
  message: string
): Promise<LogResponse | null> {
  const logger = getLogger();
  return logger.log(stack, level, packageName, message);
}
