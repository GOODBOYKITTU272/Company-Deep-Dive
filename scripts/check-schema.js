const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function checkSchema() {
    try {
        console.log('📡 Checking columns for table: karmafy_job');
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'karmafy_job'
            ORDER BY column_name
        `);
        console.table(res.rows);

        console.log('\n📡 Checking first row samples:');
        const samples = await pool.query('SELECT * FROM karmafy_job LIMIT 1');
        console.log(samples.rows[0]);

        process.exit(0);
    } catch (e) {
        console.error('❌ Error checking schema:', e);
        process.exit(1);
    }
}

checkSchema();
