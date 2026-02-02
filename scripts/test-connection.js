const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

function maskConnectionString(conn) {
    if (!conn) return 'MISSING';
    return conn.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@');
}

async function test() {
    const connectionString = process.env.DATABASE_URL || process.env.SECONDARY_DATABASE_URL;
    console.log('Testing connection to:', maskConnectionString(connectionString));
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✅ Connection successful!');
        const res = await client.query('SELECT current_database(), COUNT(*) AS total FROM karmafy_job');
        console.log('Result:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
    }
}

test();
