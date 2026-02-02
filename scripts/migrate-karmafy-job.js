/**
 * DATABASE MIGRATION SCRIPT
 * ========================
 * Transfers 500k+ records from secondary database to primary database
 * Table: karmafy_job
 * 
 * Features:
 * - Batch processing (configurable batch size)
 * - Progress tracking with ETA
 * - Error handling and logging
 * - Index management for optimal performance
 * - Resume capability
 * - Dry run mode for testing
 */

// Load environment variables immediately
require('dotenv').config({ path: '.env.local' });

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
    // Batch processing
    BATCH_SIZE: 1000, // Reduced to 1000 to stay under Postgres max parameters (65535)

    // Progress tracking
    PROGRESS_LOG_FILE: path.join(__dirname, 'migration-progress.json'),
    ERROR_LOG_FILE: path.join(__dirname, 'migration-errors.log'),

    // Safety settings
    DRY_RUN: false, // Set to true to test without inserting data
    DROP_INDEXES: true, // Drop indexes before migration (RECOMMENDED for speed)
    RECREATE_INDEXES: true, // Recreate indexes after migration

    // Performance
    CONNECTION_TIMEOUT: 60000, // 60 seconds
    QUERY_TIMEOUT: 300000, // 5 minutes per batch
};

// ============================================================================
// DATABASE CONNECTIONS
// ============================================================================

// Primary Database (Current Project - Destination)
const primaryDB = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: CONFIG.CONNECTION_TIMEOUT,
    query_timeout: CONFIG.QUERY_TIMEOUT,
    max: 10, // Connection pool size
    ssl: { rejectUnauthorized: false }
});

// Secondary Database (Source)
const secondaryDB = new Pool({
    connectionString: process.env.SECONDARY_DATABASE_URL,
    connectionTimeoutMillis: CONFIG.CONNECTION_TIMEOUT,
    query_timeout: CONFIG.QUERY_TIMEOUT,
    max: 10,
    ssl: { rejectUnauthorized: false }
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format time duration
 */
function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}

/**
 * Save progress to file
 */
function saveProgress(progress) {
    fs.writeFileSync(
        CONFIG.PROGRESS_LOG_FILE,
        JSON.stringify(progress, null, 2)
    );
}

/**
 * Load progress from file
 */
function loadProgress() {
    try {
        if (fs.existsSync(CONFIG.PROGRESS_LOG_FILE)) {
            return JSON.parse(fs.readFileSync(CONFIG.PROGRESS_LOG_FILE, 'utf8'));
        }
    } catch (error) {
        console.warn('⚠️  Could not load progress file:', error.message);
    }
    return null;
}

/**
 * Log error to file
 */
function logError(error, context = {}) {
    const timestamp = new Date().toISOString();
    const errorLog = `\n${'='.repeat(80)}\n[${timestamp}] ${context.stage || 'UNKNOWN'}\n${error.stack || error.message}\nContext: ${JSON.stringify(context, null, 2)}\n`;

    fs.appendFileSync(CONFIG.ERROR_LOG_FILE, errorLog);
    console.error('❌', error.message);
}

/**
 * Print progress bar
 */
function printProgress(current, total, startTime) {
    const percentage = ((current / total) * 100).toFixed(2);
    const barLength = 40;
    const filledLength = Math.round(barLength * current / total);
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

    const elapsed = Date.now() - startTime;
    const rate = current / (elapsed / 1000); // records per second
    const remaining = total - current;
    const eta = remaining / rate * 1000; // milliseconds

    process.stdout.write(`\r📊 Progress: [${bar}] ${percentage}% | ${current.toLocaleString()}/${total.toLocaleString()} | Rate: ${rate.toFixed(0)} rec/s | ETA: ${formatDuration(eta)} `);
}

// ============================================================================
// INDEX MANAGEMENT
// ============================================================================

/**
 * Get list of indexes on karmafy_job table
 */
async function getIndexes(client) {
    const result = await client.query(`
    SELECT indexname, indexdef
    FROM pg_indexes
    WHERE tablename = 'karmafy_job'
    AND schemaname = 'public'
    AND indexname != 'karmafy_job_pkey' -- Don't drop primary key
  `);
    return result.rows;
}

/**
 * Drop all indexes (except primary key)
 */
async function dropIndexes(client) {
    console.log('\n🔧 Dropping indexes for faster insertion...');
    const indexes = await getIndexes(client);

    for (const index of indexes) {
        try {
            await client.query(`DROP INDEX IF EXISTS ${index.indexname}`);
            console.log(`   ✓ Dropped: ${index.indexname}`);
        } catch (error) {
            console.warn(`   ⚠️  Could not drop ${index.indexname}:`, error.message);
        }
    }

    return indexes;
}

/**
 * Recreate indexes from definitions
 */
async function recreateIndexes(client, indexes) {
    console.log('\n🔧 Recreating indexes...');

    for (const index of indexes) {
        try {
            await client.query(index.indexdef);
            console.log(`   ✓ Created: ${index.indexname}`);
        } catch (error) {
            logError(error, { stage: 'RECREATE_INDEX', index: index.indexname });
        }
    }
}

// ============================================================================
// MIGRATION FUNCTIONS
// ============================================================================

/**
 * Get total count of records in source database
 */
async function getSourceRecordCount() {
    const result = await secondaryDB.query('SELECT COUNT(*) FROM karmafy_job');
    return parseInt(result.rows[0].count, 10);
}

/**
 * Verify table schemas match
 */
async function verifySchemas() {
    console.log('\n🔍 Verifying table schemas...');

    const schemaQuery = `
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'karmafy_job'
    AND table_schema = 'public'
    ORDER BY ordinal_position
  `;

    const [primarySchema, secondarySchema] = await Promise.all([
        primaryDB.query(schemaQuery),
        secondaryDB.query(schemaQuery),
    ]);

    // Compare schemas
    const primaryCols = primarySchema.rows.map(r => r.column_name).sort();
    const secondaryCols = secondarySchema.rows.map(r => r.column_name).sort();

    const missingInPrimary = secondaryCols.filter(col => !primaryCols.includes(col));
    const missingInSecondary = primaryCols.filter(col => !secondaryCols.includes(col));

    if (missingInPrimary.length > 0) {
        console.warn('⚠️  Columns in secondary but not in primary:', missingInPrimary);
    }

    if (missingInSecondary.length > 0) {
        console.warn('⚠️  Columns in primary but not in secondary:', missingInSecondary);
    }

    // Get common columns (excluding id which is auto-generated)
    const commonColumns = primaryCols.filter(col =>
        secondaryCols.includes(col) && col !== 'id'
    );

    console.log(`   ✓ Found ${commonColumns.length} common columns`);
    return commonColumns;
}

/**
 * Clear destination table
 */
async function clearDestination() {
    console.log('\n🗑️  Clearing destination table...');

    if (CONFIG.DRY_RUN) {
        console.log('   [DRY RUN] Would delete all records from karmafy_job');
        return;
    }

    const result = await primaryDB.query('DELETE FROM karmafy_job');
    console.log(`   ✓ Deleted ${result.rowCount} existing records`);
}

/**
 * Migrate data in batches
 */
async function migrateData(columns, totalRecords, resumeFrom = 0) {
    console.log('\n📦 Starting batch migration...');
    console.log(`   Batch size: ${CONFIG.BATCH_SIZE.toLocaleString()} records`);
    console.log(`   Total batches: ${Math.ceil(totalRecords / CONFIG.BATCH_SIZE)}`);

    const startTime = Date.now();
    let insertedCount = 0;
    let errorCount = 0;
    let offset = resumeFrom;

    // Build SELECT query (exclude id column)
    const selectColumns = columns.map(col => `"${col}"`).join(', ');

    while (offset < totalRecords) {
        const batchStartTime = Date.now();

        try {
            // Fetch batch from source
            const sourceQuery = `
        SELECT ${selectColumns}
        FROM karmafy_job
        ORDER BY id
        LIMIT ${CONFIG.BATCH_SIZE}
        OFFSET ${offset}
      `;

            const sourceResult = await secondaryDB.query(sourceQuery);
            const records = sourceResult.rows;

            if (records.length === 0) {
                break; // No more records
            }

            if (!CONFIG.DRY_RUN) {
                // Build INSERT query with multiple values
                const placeholders = [];
                const values = [];
                let valueIndex = 1;

                for (let i = 0; i < records.length; i++) {
                    const recordPlaceholders = columns.map(() => `$${valueIndex++}`);
                    placeholders.push(`(${recordPlaceholders.join(', ')})`);

                    // Add values in correct order
                    for (const col of columns) {
                        values.push(records[i][col]);
                    }
                }

                const insertQuery = `
          INSERT INTO karmafy_job (${columns.map(c => `"${c}"`).join(', ')})
          VALUES ${placeholders.join(', ')}
        `;

                // Execute batch insert
                await primaryDB.query(insertQuery, values);
            }

            insertedCount += records.length;
            offset += CONFIG.BATCH_SIZE;

            // Update progress
            printProgress(insertedCount, totalRecords, startTime);

            // Save progress every 10 batches
            if (Math.floor(offset / CONFIG.BATCH_SIZE) % 10 === 0) {
                saveProgress({
                    insertedCount,
                    offset,
                    totalRecords,
                    errorCount,
                    lastUpdated: new Date().toISOString(),
                });
            }

        } catch (error) {
            errorCount++;
            logError(error, {
                stage: 'BATCH_INSERT',
                offset,
                batchSize: CONFIG.BATCH_SIZE,
            });

            // Continue with next batch (don't fail entire migration)
            offset += CONFIG.BATCH_SIZE;
        }
    }

    console.log('\n'); // New line after progress bar

    const totalTime = Date.now() - startTime;
    const avgRate = insertedCount / (totalTime / 1000);

    return {
        insertedCount,
        errorCount,
        totalTime,
        avgRate,
    };
}

// ============================================================================
// MAIN MIGRATION PROCESS
// ============================================================================

async function runMigration() {
    console.log('\n' + '='.repeat(80));
    console.log('  DATABASE MIGRATION: karmafy_job');
    console.log('='.repeat(80));
    console.log(`  Mode: ${CONFIG.DRY_RUN ? 'DRY RUN (no data will be inserted)' : 'LIVE'}`);
    console.log('='.repeat(80));

    let droppedIndexes = [];
    const migrationStart = Date.now();

    try {
        // Step 1: Test connections
        console.log('\n🔌 Testing database connections...');
        await Promise.all([
            primaryDB.query('SELECT 1'),
            secondaryDB.query('SELECT 1'),
        ]);
        console.log('   ✓ Primary database connected');
        console.log('   ✓ Secondary database connected');

        // Step 2: Verify schemas
        const commonColumns = await verifySchemas();

        // Step 3: Get record count
        console.log('\n📊 Checking source data...');
        const totalRecords = await getSourceRecordCount();
        console.log(`   ✓ Found ${totalRecords.toLocaleString()} records to migrate`);

        // Step 4: Check for resume
        const savedProgress = loadProgress();
        let resumeFrom = 0;

        if (savedProgress && savedProgress.offset < totalRecords) {
            console.log(`\n⏯️  Found previous progress: ${savedProgress.insertedCount.toLocaleString()} records migrated`);
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout,
            });

            const answer = await new Promise(resolve => {
                readline.question('   Resume from last position? (y/n): ', resolve);
            });
            readline.close();

            if (answer.toLowerCase() === 'y') {
                resumeFrom = savedProgress.offset;
            } else {
                // Clear destination if starting fresh
                await clearDestination();
            }
        } else if (!CONFIG.DRY_RUN) {
            // First run - ask to clear destination
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout,
            });

            const answer = await new Promise(resolve => {
                readline.question('\n⚠️  Clear destination table before migration? (y/n): ', resolve);
            });
            readline.close();

            if (answer.toLowerCase() === 'y') {
                await clearDestination();
            }
        }

        // Step 5: Drop indexes for performance
        if (CONFIG.DROP_INDEXES && !CONFIG.DRY_RUN) {
            droppedIndexes = await dropIndexes(primaryDB);
        }

        // Step 6: Migrate data
        const result = await migrateData(commonColumns, totalRecords, resumeFrom);

        // Step 7: Recreate indexes
        if (CONFIG.RECREATE_INDEXES && droppedIndexes.length > 0 && !CONFIG.DRY_RUN) {
            await recreateIndexes(primaryDB, droppedIndexes);
        }

        // Step 8: Update statistics
        if (!CONFIG.DRY_RUN) {
            console.log('\n🔧 Updating table statistics...');
            await primaryDB.query('ANALYZE karmafy_job');
            console.log('   ✓ Statistics updated');
        }

        // Final report
        const totalDuration = Date.now() - migrationStart;

        console.log('\n' + '='.repeat(80));
        console.log('  MIGRATION COMPLETE!');
        console.log('='.repeat(80));
        console.log(`  Records inserted: ${result.insertedCount.toLocaleString()} / ${totalRecords.toLocaleString()}`);
        console.log(`  Errors: ${result.errorCount}`);
        console.log(`  Total time: ${formatDuration(totalDuration)}`);
        console.log(`  Average rate: ${result.avgRate.toFixed(0)} records/second`);
        console.log('='.repeat(80));

        if (result.errorCount > 0) {
            console.log(`\n⚠️  Check error log for details: ${CONFIG.ERROR_LOG_FILE}`);
        }

        // Cleanup progress file on success
        if (result.insertedCount === totalRecords && fs.existsSync(CONFIG.PROGRESS_LOG_FILE)) {
            fs.unlinkSync(CONFIG.PROGRESS_LOG_FILE);
        }

    } catch (error) {
        console.error('\n❌ MIGRATION FAILED\n');
        logError(error, { stage: 'MAIN_PROCESS' });

        // Try to recreate indexes even if migration failed
        if (droppedIndexes.length > 0 && !CONFIG.DRY_RUN) {
            console.log('\n🔧 Attempting to recreate indexes after failure...');
            try {
                await recreateIndexes(primaryDB, droppedIndexes);
            } catch (indexError) {
                console.error('❌ Could not recreate indexes:', indexError.message);
            }
        }

        process.exit(1);
    } finally {
        // Close connections
        await primaryDB.end();
        await secondaryDB.end();
    }
}

// ============================================================================
// ENTRY POINT
// ============================================================================

// Validate environment variables
if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in .env.local');
    process.exit(1);
}

if (!process.env.SECONDARY_DATABASE_URL) {
    console.error('❌ SECONDARY_DATABASE_URL not found in .env.local');
    console.log('\n💡 Add this to your .env.local file:');
    console.log('   SECONDARY_DATABASE_URL=postgresql://user:pass@host:port/database\n');
    process.exit(1);
}

// Run migration
runMigration().catch(error => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
});
