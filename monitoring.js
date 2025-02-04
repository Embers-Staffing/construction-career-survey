'use strict';

import promBundle from 'express-prom-bundle';
import client from 'prom-client';

// Create a Registry
const register = new client.Registry();

// Create middleware with explicit configuration
const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
    promRegistry: register,
    buckets: [0.1, 0.5, 1, 2, 5], // Define histogram buckets
    normalizePath: [
        ['^/static/.*', '/static/#path'], // Normalize static paths
        ['^/api/.*', '/api/#path']        // Normalize API paths
    ],
    formatStatusCode: (res) => res.status, // Use status directly
    autoregister: false, // Prevent auto-registration
    promClient: {
        collectDefaultMetrics: {
            prefix: 'app_',  // Add prefix to prevent conflicts
            register
        }
    }
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
