import promBundle from 'express-prom-bundle';
import client from 'prom-client';

// Create a Registry
const register = new client.Registry();

// Add default metrics (e.g., memory usage, CPU usage)
client.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 0.5, 1, 2, 5]
});

// Register the custom metrics
register.registerMetric(httpRequestDurationMicroseconds);

// Create middleware
const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
    promClient: client,
    promRegistry: register
});

// Health metrics function
const getHealthMetrics = () => {
    const memoryUsage = process.memoryUsage();
    const uptimeHours = process.uptime() / 3600;
    
    return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: {
            hours: uptimeHours.toFixed(2),
            days: (uptimeHours / 24).toFixed(2)
        },
        memory: {
            heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
            heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
            rss: Math.round(memoryUsage.rss / 1024 / 1024),
            external: Math.round(memoryUsage.external / 1024 / 1024)
        },
        node: {
            version: process.version,
            platform: process.platform,
            pid: process.pid
        }
    };
};

export { metricsMiddleware, getHealthMetrics, register };
