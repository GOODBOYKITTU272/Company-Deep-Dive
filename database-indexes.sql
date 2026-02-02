-- Performance Optimization Indexes for karmafy_job table
-- Run this script on your PostgreSQL database to dramatically improve API response times

-- ==================== INDEXES ====================

-- Index 1: Upload Date (Most frequently queried field)
-- Used by: All APIs for date filtering
CREATE INDEX IF NOT EXISTS idx_karmafy_job_upload_date 
ON public.karmafy_job("uploadDate");

-- Index 2: Company Name (Case-insensitive searches)
-- Used by: Company Heatmap and Deep Dive APIs
CREATE INDEX IF NOT EXISTS idx_karmafy_job_company_lower 
ON public.karmafy_job(LOWER(company));

-- Index 3: Date Posted (Time-based filtering)
-- Used by: 24-hour and 7-day aggregations
CREATE INDEX IF NOT EXISTS idx_karmafy_job_date_posted 
ON public.karmafy_job("datePosted");

-- Index 4: Job Title (Role filtering)
-- Used by: Job Listings API with role filters
CREATE INDEX IF NOT EXISTS idx_karmafy_job_title 
ON public.karmafy_job(title);

-- Index 5: Composite Index (Upload Date + Company)
-- Used by: Company metrics calculations
CREATE INDEX IF NOT EXISTS idx_karmafy_job_upload_company 
ON public.karmafy_job("uploadDate", company);

-- ==================== STATISTICS ====================

-- Update table statistics for query planner optimization
ANALYZE public.karmafy_job;

-- ==================== VERIFICATION ====================

-- Check if indexes were created successfully
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'karmafy_job'
ORDER BY indexname;

-- Check index sizes
SELECT 
    indexname,
    pg_size_pretty(pg_relation_size(indexname::regclass)) as size
FROM pg_indexes
WHERE tablename = 'karmafy_job';

-- ==================== PERFORMANCE TEST ====================

-- Test query performance (should use idx_karmafy_job_upload_date)
EXPLAIN ANALYZE
SELECT COUNT(*) 
FROM public.karmafy_job 
WHERE "uploadDate"::date = '2026-01-31';

-- Test company query performance (should use idx_karmafy_job_company_lower)
EXPLAIN ANALYZE
SELECT COUNT(*) 
FROM public.karmafy_job 
WHERE LOWER(company) = 'microsoft';

-- Expected: "Index Scan" instead of "Seq Scan"
-- Expected: Execution time < 50ms
