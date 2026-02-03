// Database connection utility for Vercel Serverless Functions
// Uses connection pooling for optimal performance

import { Pool } from 'pg';

let pool = null;

/**
 * Get or create PostgreSQL connection pool
 * Reuses connections across function invocations for better performance
 */
export function getPool() {
    if (!pool) {
        const connStr = process.env.DATABASE_URL || '';
        const host = connStr.split('@')[1] || 'localhost:5432';
        console.log(`🔌 Initializing DB Pool pointing to: ${host.split('/')[0]}`);

        pool = new Pool({
            connectionString: connStr,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
            max: 10, // Maximum pool size
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        pool.on('error', (err) => {
            console.error('Unexpected database pool error', err);
        });
    }
    return pool;
}

/**
 * Execute a query with automatic connection handling
 */
export async function query(text, params) {
    const client = getPool();
    try {
        const start = Date.now();
        const res = await client.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text: text.substring(0, 100), duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

/**
 * Close the pool (for cleanup, rarely needed in serverless)
 */
export async function closePool() {
    if (pool) {
        await pool.end();
        pool = null;
    }
}
