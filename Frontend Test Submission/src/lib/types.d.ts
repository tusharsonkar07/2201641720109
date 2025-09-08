export type Stack = 'backend' | 'frontend';
export type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type Package = 'cache' | 'controller' | 'cron_job' | 'db' | 'domain' | 'handler' | 'repository' | 'route' | 'service' | 'api' | 'component' | 'hook' | 'page' | 'state' | 'style' | 'auth' | 'config' | 'middleware' | 'utils';
export interface LogRequest {
    stack: Stack;
    level: Level;
    package: Package;
    message: string;
}
export interface LogResponse {
    logID: string;
    message: string;
}
export interface LoggerConfig {
    apiUrl: string;
    accessToken: string;
    enabled: boolean;
    timeout?: number;
}
//# sourceMappingURL=types.d.ts.map