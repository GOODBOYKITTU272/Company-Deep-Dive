-- ============================================================================
-- SUPABASE DATABASE SETUP - PRODUCTION VERSION (NO SAMPLE DATA)
-- Copy this ENTIRE script and paste into Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- TABLE 1: karmafy_job (JOB POSTINGS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.karmafy_job
(
    source character varying(255) NOT NULL,
    title text NOT NULL,
    company text NOT NULL,
    location text NOT NULL,
    url text NOT NULL,
    description text NOT NULL,
    "rawText" text NOT NULL,
    "datePosted" timestamp with time zone NOT NULL,
    "hoursBackPosted" integer NOT NULL,
    "yearsExpRequired" text,
    "roleId" text,
    "uploadDate" timestamp with time zone NOT NULL,
    "ingestedAt" timestamp with time zone NOT NULL,
    "scrapingStatus" character varying(50) NOT NULL,
    "scrapedContentUrl" text,
    "scrapedAt" timestamp with time zone,
    "lastScrapingAttempt" timestamp with time zone,
    "scrapingError" text,
    "reservedAt" timestamp with time zone,
    "reservedBy" text,
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    "applyType" text,
    industry_type text,
    is_c2c_or_w2 text,
    company_logo_url text,
    posted_by_profile text,
    contract_type text,
    company_url text,
    experience_level text,
    poster_full_name text,
    salary text,
    work_type text,
    is_staffing text,
    is_sponsored text,
    CONSTRAINT karmafy_job_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- TABLE 2: karmafy_jobrole (ROLE DEFINITIONS FOR NORMALIZATION)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.karmafy_jobrole
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY,
    name text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    alternate_roles text,
    keywords text,
    "jobTitlesToApplyFor" text,
    CONSTRAINT karmafy_jobrole_pkey PRIMARY KEY (id)
);

-- ============================================================================
-- CRITICAL PERFORMANCE INDEXES
-- ============================================================================

-- Index 1: Upload Date (most queried field - used by ALL APIs)
CREATE INDEX IF NOT EXISTS idx_karmafy_job_upload_date 
ON public.karmafy_job("uploadDate");

-- Index 2: Company (for Company Heatmap & Deep Dive)
CREATE INDEX IF NOT EXISTS idx_karmafy_job_company 
ON public.karmafy_job(company);

-- Index 3: Date Posted (for 24h/7d calculations)
CREATE INDEX IF NOT EXISTS idx_karmafy_job_date_posted 
ON public.karmafy_job("datePosted");

-- Index 4: Title (for job listings filtering)
CREATE INDEX IF NOT EXISTS idx_karmafy_job_title 
ON public.karmafy_job(title);

-- Index 5: Composite (upload date + company for faster queries)
CREATE INDEX IF NOT EXISTS idx_karmafy_job_upload_company 
ON public.karmafy_job("uploadDate", company);

-- Index 6: Role name lookup
CREATE INDEX IF NOT EXISTS idx_karmafy_jobrole_name 
ON public.karmafy_jobrole(name);

-- ============================================================================
-- UPDATE STATISTICS FOR QUERY OPTIMIZER
-- ============================================================================

ANALYZE public.karmafy_job;
ANALYZE public.karmafy_jobrole;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check tables exist
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('karmafy_job', 'karmafy_jobrole')
ORDER BY table_name;

-- Check indexes
SELECT 
    tablename,
    indexname
FROM pg_indexes
WHERE tablename IN ('karmafy_job', 'karmafy_jobrole')
ORDER BY tablename, indexname;

-- Check data counts
SELECT 
    'karmafy_job' as table_name,
    COUNT(*) as row_count
FROM karmafy_job
UNION ALL
SELECT 
    'karmafy_jobrole' as table_name,
    COUNT(*) as row_count
FROM karmafy_jobrole;

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- ✅ Tables created (or verified if they already exist)
-- ✅ Indexes added for optimal performance
-- ✅ Statistics updated
-- 
-- NEXT STEPS:
-- 1. Import your existing job data into karmafy_job (if needed)
-- 2. Add role definitions to karmafy_jobrole (if needed)
-- 3. Get your DATABASE_URL from Supabase settings
-- 4. Add to .env.local in your project
-- 5. Test API endpoints!
-- 
-- Connection string format:
-- postgresql://postgres.molwtyvcjwtxubcahijx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
-- ============================================================================
