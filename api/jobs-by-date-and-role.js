// Vercel Serverless Function - API Proxy
// This proxies requests to the ApplyWizz API to avoid CORS issues

export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get the date parameter from query string
    const { date } = req.query;

    console.log('Serverless function called with date:', date);
    console.log('Full query:', req.query);

    if (!date) {
        return res.status(400).json({
            error: 'Date parameter is required',
            received: req.query
        });
    }

    try {
        // Fetch data from the real API
        const apiUrl = `https://dashboard.apply-wizz.com/jobs-by-date-and-role/?date=${date}`;
        console.log('Proxying request to:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'ApplyWizz-Dashboard/1.0'
            }
        });

        console.log('API response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', response.status, errorText);
            return res.status(response.status).json({
                error: {
                    code: response.status,
                    message: response.statusText,
                    details: errorText
                }
            });
        }

        const data = await response.json();
        console.log('Successfully fetched data, roles count:', Object.keys(data).length);

        // Set CORS headers to allow frontend access
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // Cache for 5 minutes
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

        return res.status(200).json(data);

    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({
            error: {
                code: '500',
                message: 'Internal server error',
                details: error.message
            }
        });
    }
}
