import http from 'http';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;
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

const server = http.createServer(async (req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    // Handle favicon.ico requests
    if (req.url === '/favicon.ico') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Normalize the URL
    let filePath = join(__dirname, req.url === '/' ? 'index.html' : req.url);
    
    try {
        // Check if file exists and read it
        const data = await fs.readFile(filePath);
        
        // Get the file extension and content type
        const ext = extname(filePath);
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        
        // Send the response
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    } catch (error) {
        // If file not found or error reading file
        console.error(`Error serving ${filePath}:`, error);
        if (error.code === 'ENOENT') {
            res.writeHead(404);
            res.end('404 Not Found');
        } else {
            res.writeHead(500);
            res.end('500 Internal Server Error');
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
