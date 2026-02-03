const http = require('http');
const url = require('url');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const port = 4001;

async function startServer() {
    const server = http.createServer(async (req, res) => {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        const apiPath = pathname.startsWith('/api/') ? pathname.slice(5) : pathname; // Remove /api/ prefix if present

        // Remove trailing slash if present
        const cleanPath = apiPath.replace(/\/$/, '');
        const handlerPath = `../api/${cleanPath}.js`;

        console.log(`🔌 Request: ${pathname} -> Routing to: ${handlerPath}`);

        // Mock res.status, res.json, res.setHeader etc as they are expected by Vercel handlers
        const mockRes = {
            statusCode: 200,
            headers: {},
            setHeader(name, value) { this.headers[name] = value; return this; },
            status(code) { this.statusCode = code; return this; },
            json(data) {
                res.writeHead(this.statusCode, { ...this.headers, 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
                return this;
            },
            end(data) {
                res.writeHead(this.statusCode, this.headers);
                res.end(data);
                return this;
            }
        };

        const mockReq = {
            method: req.method,
            query: parsedUrl.query,
            headers: req.headers,
            url: req.url
        };

        try {
            const handler = await import(handlerPath);
            await handler.default(mockReq, mockRes);
        } catch (e) {
            console.error(`❌ Error handling ${pathname}:`, e.message);
            if (e.code === 'ERR_MODULE_NOT_FOUND' || e.message.includes('Cannot find module')) {
                res.writeHead(404);
                res.end(`Not Found: ${handlerPath}`);
            } else {
                mockRes.status(500).json({ error: e.message, stack: e.stack });
            }
        }
    });

    server.listen(port, '127.0.0.1', () => {
        console.log(`🚀 Native Mock API server running at http://127.0.0.1:${port}`);
    });
}

startServer();
