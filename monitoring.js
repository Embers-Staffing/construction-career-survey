import promBundle from 'express-prom-bundle';
import { register, collectDefaultMetrics } from 'prom-client';

// Collect default Node.js metrics
collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestDurationMicroseconds = new register.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const memoryUsageGauge = new register.Gauge({
    name: 'nodejs_memory_usage_bytes',
    help: 'Memory usage of the Node.js process in bytes',
    labelNames: ['type']
});

// Update memory metrics every 15 seconds
setInterval(() => {
    const memoryUsage = process.memoryUsage();
    memoryUsageGauge.set({ type: 'rss' }, memoryUsage.rss);
    memoryUsageGauge.set({ type: 'heapTotal' }, memoryUsage.heapTotal);
    memoryUsageGauge.set({ type: 'heapUsed' }, memoryUsage.heapUsed);
    memoryUsageGauge.set({ type: 'external' }, memoryUsage.external);
}, 15000);

// Create middleware
export const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
    includeStatusCode: true,
    includeUp: true,
    customLabels: { project: 'construction-career-survey' },
    promClient: { collectDefaultMetrics: {} }
});

// Create health check endpoint data
export const getHealthMetrics = () => {
    const memoryUsage = process.memoryUsage();
    const totalMemoryMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
    const usedMemoryMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const memoryUsagePercent = Math.round((usedMemoryMB / totalMemoryMB) * 100);

    return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        memory: {
            total: `${totalMemoryMB}MB`,
            used: `${usedMemoryMB}MB`,
            percentage: `${memoryUsagePercent}%`
        },
        uptime: process.uptime(),
        version: process.version
    };
};
