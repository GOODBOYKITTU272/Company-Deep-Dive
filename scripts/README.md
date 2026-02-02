# Database Migration Scripts

This directory contains scripts for migrating data between databases.

## Available Scripts

### `migrate-karmafy-job.js`

**Purpose:** Transfer 500k+ records from a secondary database to your primary Supabase database.

**Features:**
- ✅ Batch processing (2000 records per batch)
- ✅ Progress tracking with ETA
- ✅ Auto-resume on failure
- ✅ Index optimization
- ✅ Error logging
- ✅ Dry run mode

**Quick Start:**

1. Add secondary database connection to `.env.local`:
   ```env
   SECONDARY_DATABASE_URL=postgresql://user:pass@host:port/database
   ```

2. Run the migration:
   ```bash
   node scripts/migrate-karmafy-job.js
   ```

3. Follow the prompts and monitor progress

**Full Documentation:** See `DATABASE_MIGRATION_GUIDE.md` in the project root.

---

## Configuration

All scripts read from `.env.local` in the project root.

**Required environment variables:**
- `DATABASE_URL` - Primary database (destination)
- `SECONDARY_DATABASE_URL` - Secondary database (source)

**Example `.env.local`:**
```env
# Primary Database (Supabase)
DATABASE_URL=postgresql://postgres.molwtyvcjwtxubcahijx:password@aws-1-ap-south-1.pooler.supabase.com:6543/postgres

# Secondary Database (Source for migration)
SECONDARY_DATABASE_URL=postgresql://user:password@other-host:5432/database
```

---

## Troubleshooting

### Migration is slow
- Increase `BATCH_SIZE` in the script (try 5000 or 10000)
- Ensure `DROP_INDEXES: true` is set
- Run from a server closer to the databases

### Migration fails partway through
- The script auto-saves progress
- Simply run again and choose "y" to resume

### Memory errors
- Reduce `BATCH_SIZE` to 500 or 1000
- Increase Node.js memory: `node --max-old-space-size=4096 scripts/migrate-karmafy-job.js`

---

## Support

For detailed help, see:
- `DATABASE_MIGRATION_GUIDE.md` - Full migration guide
- `migration-errors.log` - Error log (created during migration)
- `migration-progress.json` - Progress tracker (created during migration)
