import http from 'http';
import express from 'express';
import helmet from 'helmet';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import { metricsMiddleware, getHealthMetrics, register } from './monitoring.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;
const app = express();

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
};

// Security middleware
app.use(helmet());
app.use(helmet.hsts({
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true
}));

// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            res.redirect(`https://${req.header('host')}${req.url}`);
        } else {
            next();
        }
    });
}

// Add monitoring middleware
app.use(metricsMiddleware);

// Serve metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        const metrics = await register.metrics();
        res.end(metrics);
    } catch (err) {
        res.status(500).end(err.message);
    }
});

// Enhanced health check endpoint
app.get('/health', (req, res) => {
    res.json(getHealthMetrics());
});

// Static file serving with monitoring
app.get('*', async (req, res) => {
    try {
        // Handle favicon.ico requests
        if (req.url === '/favicon.ico') {
            res.writeHead(204);
            res.end();
            return;
        }

        // Normalize the URL
        let filePath = join(__dirname, req.url === '/' ? 'index.html' : req.url);
        
        // Check if file exists and read it
        const data = await fs.readFile(filePath);
        
        // Get the file extension and content type
        const ext = extname(filePath);
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        
        // Send the response
        res.set('Content-Type', contentType);
        res.send(data);
    } catch (error) {
        console.error(`Error serving ${req.url}:`, error);
        if (error.code === 'ENOENT') {
            res.status(404).send('404 Not Found');
        } else {
            res.status(500).send('500 Internal Server Error');
        }
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Metrics available at http://localhost:${PORT}/metrics`);
    console.log(`Health check at http://localhost:${PORT}/health`);
});
