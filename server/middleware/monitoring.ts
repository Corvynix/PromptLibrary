import * as Sentry from '@sentry/node';
import { Express, Request, Response } from 'express';
import { register, collectDefaultMetrics, Counter, Histogram } from 'prom-client';

// Initialize Sentry (optional)
export function initSentry(app: Express) {
    // Sentry is optional - only initialize if DSN is provided
    if (process.env.SENTRY_DSN) {
        try {
            Sentry.init({
                dsn: process.env.SENTRY_DSN,
                environment: process.env.NODE_ENV || 'development',
                tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
            });
            console.log('Sentry initialized');
        } catch (error) {
            console.warn('Sentry initialization failed (optional):', error);
        }
    }
}

// Error handler for Sentry
export const sentryErrorHandler = (err: any, req: any, res: any, next: any) => {
    if (process.env.SENTRY_DSN) {
        Sentry.captureException(err);
    }
    next(err);
};

// Prometheus metrics
collectDefaultMetrics({ prefix: 'promptlib_' });

const httpRequestDuration = new Histogram({
    name: 'promptlib_http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
});

const httpRequestTotal = new Counter({
    name: 'promptlib_http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
});

// Metrics middleware
export function metricsMiddleware(req: Request, res: Response, next: Function) {
    const start = Date.now();

    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        const route = (req as any).route?.path || req.path;

        httpRequestDuration.observe(
            { method: req.method, route, status_code: res.statusCode },
            duration
        );

        httpRequestTotal.inc({
            method: req.method,
            route,
            status_code: res.statusCode,
        });
    });

    next();
}

// Metrics endpoint
export function metricsEndpoint(req: Request, res: Response) {
    res.set('Content-Type', register.contentType);
    res.end(register.metrics());
}

// Health check endpoint
export function healthCheck(req: Request, res: Response) {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
}
