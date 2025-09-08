import { LogResponse, LoggerConfig, Stack, Level, Package } from './types';
/**
 * AFFORDMED Logging Middleware
 * Reusable logging package for capturing application events
 */
export declare class Logger {
    private config;
    private isEnabled;
    constructor(config: LoggerConfig);
    /**
     * Log a message to the AFFORDMED test server
     * @param stack - 'backend' or 'frontend'
     * @param level - 'debug', 'info', 'warn', 'error', or 'fatal'
     * @param packageName - The package/module name
     * @param message - Descriptive message about what's happening
     */
    log(stack: Stack, level: Level, packageName: Package, message: string): Promise<LogResponse | null>;
    /**
     * Convenience method for debug logs
     */
    debug(packageName: Package, message: string): Promise<LogResponse | null>;
    /**
     * Convenience method for info logs
     */
    info(packageName: Package, message: string): Promise<LogResponse | null>;
    /**
     * Convenience method for warning logs
     */
    warn(packageName: Package, message: string): Promise<LogResponse | null>;
    /**
     * Convenience method for error logs
     */
    error(packageName: Package, message: string): Promise<LogResponse | null>;
    /**
     * Convenience method for fatal logs
     */
    fatal(packageName: Package, message: string): Promise<LogResponse | null>;
    /**
     * Enable or disable logging
     */
    setEnabled(enabled: boolean): void;
    /**
     * Update the access token
     */
    updateToken(token: string): void;
    /**
     * Validate logging inputs according to AFFORDMED requirements
     */
    private validateInputs;
}
/**
 * Initialize the default logger
 */
export declare function initializeLogger(config: LoggerConfig): Logger;
/**
 * Get the default logger instance
 */
export declare function getLogger(): Logger;
/**
 * Convenience function for logging (uses default logger)
 */
export declare function log(stack: Stack, level: Level, packageName: Package, message: string): Promise<LogResponse | null>;
//# sourceMappingURL=logger.d.ts.map