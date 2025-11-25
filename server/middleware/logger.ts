import pino from 'pino';
import pinoHttp from 'pino-http';

// Create logger instance
export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development' ? {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
        },
    } : undefined,
});

// HTTP request logger middleware
export const httpLogger = pinoHttp({
    logger,
    autoLogging: {
        ignore: (req) => req.url === '/health' || req.url === '/metrics',
    },
    customLogLevel: (req, res, err) => {
        if (res.statusCode >= 500 || err) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
    },
    serializers: {
        req: (req) => ({
            method: req.method,
            url: req.url,
            query: req.query,
            params: req.params,
            // Don't log sensitive data
            headers: {
                host: req.headers.host,
                'user-agent': req.headers['user-agent'],
            },
        }),
        res: (res) => ({
            statusCode: res.statusCode,
        }),
    },
});
