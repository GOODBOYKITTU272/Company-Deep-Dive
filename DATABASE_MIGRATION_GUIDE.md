# Database Migration Guide: karmafy_job (500k+ Records)

## 📋 Overview

This guide explains how to migrate 500k+ records from your secondary database to your primary Supabase database.

**Table:** `karmafy_job`  
**Estimated Time:** 10-30 minutes (depending on network speed and database performance)  
**Method:** Batch processing with automatic progress tracking

---

## 🚀 Quick Start

### Step 1: Add Secondary Database Connection

Add this line to your `.env.local` file:

```env
SECONDARY_DATABASE_URL=postgresql://user:password@host:port/database
```

**Example:**
```env
SECONDARY_DATABASE_URL=postgresql://postgres:mypassword@db.example.supabase.co:5432/postgres
```

### Step 2: Run Migration (Dry Run First)

Test the migration without inserting data:

```bash
node scripts/migrate-karmafy-job.js
```

The script is set to `DRY_RUN: false` by default. To test first, edit the script and change:
```javascript
DRY_RUN: true,  // Set to true to test without inserting
```

### Step 3: Run Live Migration

Once you've confirmed the dry run works, set `DRY_RUN: false` and run:

```bash
node scripts/migrate-karmafy-job.js
```

---

## ⚙️ Configuration Options

Edit these settings in `scripts/migrate-karmafy-job.js`:

```javascript
const CONFIG = {
  // Adjust batch size (smaller = slower but safer, larger = faster but more memory)
  BATCH_SIZE: 2000,         // Default: 2000 records per batch
  
  // Test mode
  DRY_RUN: false,           // Set to true to test without inserting
  
  // Performance optimization
  DROP_INDEXES: true,       // Drop indexes before migration (RECOMMENDED)
  RECREATE_INDEXES: true,   // Recreate indexes after migration
};
```

### Recommended Batch Sizes:

- **Small DB/Slow Network:** 500-1000 records
- **Medium (Default):** 2000 records
- **Large DB/Fast Network:** 5000-10000 records

---

## 📊 Migration Process

The script follows these steps:

1. ✅ **Connection Test** - Verifies both databases are accessible
2. ✅ **Schema Verification** - Ensures table structures match
3. ✅ **Record Count** - Counts total records to migrate
4. ✅ **Index Removal** - Temporarily drops indexes for faster insertion
5. ✅ **Batch Migration** - Transfers data in configurable batches
6. ✅ **Progress Tracking** - Shows real-time progress with ETA
7. ✅ **Index Recreation** - Rebuilds all indexes
8. ✅ **Statistics Update** - Updates PostgreSQL statistics for query optimization

---

## 🎯 Features

### ✅ Batch Processing
- Processes records in chunks to avoid memory issues
- Configurable batch size
- Prevents timeout errors

### ✅ Progress Tracking
- Real-time progress bar with percentage
- Shows records/second rate
- Estimates time remaining (ETA)
- Saves progress every 10 batches

### ✅ Resume Capability
- Automatically saves progress to `migration-progress.json`
- Can resume from last position if interrupted
- Prevents duplicate work

### ✅ Error Handling
- Continues on batch errors (doesn't fail entire migration)
- Logs all errors to `migration-errors.log`
- Detailed error context for debugging

### ✅ Index Optimization
- Automatically drops indexes before migration
- Recreates all indexes after completion
- 10-20x faster insertion speed

### ✅ Safety Features
- Dry run mode for testing
- Confirmation prompts before clearing data
- Schema validation before migration
- Transaction-safe batch inserts

---

## 📝 Sample Output

```
================================================================================
  DATABASE MIGRATION: karmafy_job
================================================================================
  Mode: LIVE
================================================================================

🔌 Testing database connections...
   ✓ Primary database connected
   ✓ Secondary database connected

🔍 Verifying table schemas...
   ✓ Found 32 common columns

📊 Checking source data...
   ✓ Found 523,456 records to migrate

⚠️  Clear destination table before migration? (y/n): y

🗑️  Clearing destination table...
   ✓ Deleted 0 existing records

🔧 Dropping indexes for faster insertion...
   ✓ Dropped: idx_karmafy_job_upload_date
   ✓ Dropped: idx_karmafy_job_company
   ✓ Dropped: idx_karmafy_job_date_posted
   ✓ Dropped: idx_karmafy_job_title
   ✓ Dropped: idx_karmafy_job_upload_company

📦 Starting batch migration...
   Batch size: 2,000 records
   Total batches: 262

📊 Progress: [████████████████████████████████████████] 100.00% | 523,456/523,456 | Rate: 1856 rec/s | ETA: 0s 

🔧 Recreating indexes...
   ✓ Created: idx_karmafy_job_upload_date
   ✓ Created: idx_karmafy_job_company
   ✓ Created: idx_karmafy_job_date_posted
   ✓ Created: idx_karmafy_job_title
   ✓ Created: idx_karmafy_job_upload_company

🔧 Updating table statistics...
   ✓ Statistics updated

================================================================================
  MIGRATION COMPLETE!
================================================================================
  Records inserted: 523,456 / 523,456
  Errors: 0
  Total time: 4m 42s
  Average rate: 1856 records/second
================================================================================
```

---

## 🔧 Troubleshooting

### Issue: "SECONDARY_DATABASE_URL not found"

**Solution:** Add the secondary database connection string to `.env.local`

```env
SECONDARY_DATABASE_URL=postgresql://user:pass@host:port/database
```

---

### Issue: "Schema mismatch" or "Column not found"

**Solution:** The script automatically handles this by only migrating common columns. Check the console output to see which columns are being migrated.

If you need to migrate additional columns, update the primary database schema first using the SQL editor in Supabase.

---

### Issue: Migration is very slow

**Solutions:**

1. **Increase batch size:** Change `BATCH_SIZE` from 2000 to 5000 or 10000
2. **Ensure indexes are dropped:** Verify `DROP_INDEXES: true` in config
3. **Check network speed:** Slow network = slow migration
4. **Use connection pooling:** The script already uses this
5. **Run closer to database:** Consider running from a cloud VM in the same region

---

### Issue: Migration interrupted/crashed

**Solution:** The script automatically saves progress. When you run it again, it will ask if you want to resume from the last position. Answer "y" to continue where you left off.

---

### Issue: Memory errors

**Solutions:**

1. **Reduce batch size:** Change `BATCH_SIZE` to 500 or 1000
2. **Increase Node.js memory:**
   ```bash
   node --max-old-space-size=4096 scripts/migrate-karmafy-job.js
   ```

---

### Issue: Timeout errors

**Solutions:**

1. The script has built-in timeout handling (5 minutes per batch)
2. Reduce batch size if timeouts persist
3. Check database performance (CPU/Memory usage)

---

## 🔒 Security Notes

1. **Never commit `.env.local`** - It's in `.gitignore` by default
2. **Use strong passwords** - For both databases
3. **Remove secondary DB credentials after migration** - Delete the `SECONDARY_DATABASE_URL` line from `.env.local` once migration is complete
4. **Verify data integrity** - Run count queries on both databases to confirm

---

## ✅ Post-Migration Verification

After migration completes, verify the data:

### 1. Check Record Count

Run this in Supabase SQL Editor:

```sql
SELECT COUNT(*) FROM karmafy_job;
```

Should match the number from your secondary database.

### 2. Check Indexes

```sql
SELECT 
  tablename,
  indexname
FROM pg_indexes
WHERE tablename = 'karmafy_job'
ORDER BY indexname;
```

You should see all 6 indexes (including primary key).

### 3. Check Sample Data

```sql
SELECT 
  id, 
  title, 
  company, 
  "uploadDate", 
  "datePosted"
FROM karmafy_job
ORDER BY id
LIMIT 10;
```

### 4. Test Your APIs

Visit your dashboard endpoints to ensure they work with the new data:
- http://localhost:3000/api/command-center?date=2026-02-02
- http://localhost:3000/api/jobs-by-date-and-role/?date=2026-02-01

---

## 📁 Generated Files

After running the migration, you'll see these files:

- `migration-progress.json` - Progress tracker (deleted on successful completion)
- `migration-errors.log` - Error log (only if errors occurred)

You can safely delete these files after a successful migration.

---

## 🎓 Performance Expectations

Based on typical PostgreSQL performance:

| Record Count | Estimated Time | Batch Size |
|--------------|----------------|------------|
| 100,000      | 1-2 minutes    | 2000       |
| 500,000      | 5-10 minutes   | 2000       |
| 1,000,000    | 10-20 minutes  | 5000       |

**Factors affecting speed:**
- Network latency between databases
- Database CPU/Memory
- Batch size
- Whether indexes are dropped during migration

---

## 🚨 Important Notes

### ⚠️ Data Loss Warning

This script can **clear your destination table** if you answer "y" to the prompt. Make sure you're migrating to the correct database!

### ⚠️ Identity Column Handling

The script **does not migrate** the `id` column because it's defined as `GENERATED ALWAYS AS IDENTITY`. PostgreSQL will auto-generate new IDs in the destination database.

If you need to preserve original IDs, you'll need to:

1. Temporarily alter the column to allow manual insertion
2. Migrate with IDs
3. Restore the identity generation

Let me know if you need this advanced scenario.

### ⚠️ Production Database

If migrating to a **production database**, consider:

1. Schedule migration during low-traffic hours
2. Set up read replicas to serve queries during migration
3. Test thoroughly in staging first
4. Have a rollback plan

---

## 🆘 Need Help?

If you encounter issues:

1. Check `migration-errors.log` for detailed error messages
2. Verify both database connection strings are correct
3. Ensure the `karmafy_job` table exists in both databases
4. Check that you have sufficient permissions (INSERT, DROP INDEX, CREATE INDEX)
5. Try running in dry run mode first: `DRY_RUN: true`

---

## 📞 Support

For additional help, check:
- Error log: `migration-errors.log`
- Progress file: `migration-progress.json`
- Supabase logs: https://supabase.com/dashboard/project/molwtyvcjwtxubcahijx/logs

---

## ✅ Migration Checklist

Before starting:
- [ ] Added `SECONDARY_DATABASE_URL` to `.env.local`
- [ ] Verified both databases are accessible
- [ ] Backed up existing data (if any)
- [ ] Tested with `DRY_RUN: true`
- [ ] Reviewed configuration settings

After completion:
- [ ] Verified record count matches
- [ ] Confirmed indexes were recreated
- [ ] Tested API endpoints
- [ ] Removed `SECONDARY_DATABASE_URL` from `.env.local`
- [ ] Deleted migration log files

---

**Ready to migrate?** Follow the Quick Start section at the top! 🚀
