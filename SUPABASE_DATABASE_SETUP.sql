-- ============================================================================
-- SUPABASE DATABASE SETUP FOR APPLYWIZZ HIRING INTELLIGENCE DASHBOARD
-- ============================================================================
-- This script creates all required tables for the 4 main dashboard tabs:
--   1. 📊 Command Center
--   2. 📋 Job Listings  
--   3. 🔥 Company Heatmap
--   4. 🔍 Company Deep Dive
-- ============================================================================

-- ============================================================================
-- TABLE 1: karmafy_job (MAIN JOB POSTINGS TABLE)
-- ============================================================================
-- Used by: ALL 4 TABS
-- This is the core table containing all job posting data

CREATE TABLE IF NOT EXISTS public.karmafy_job (
    -- Primary identifier
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    
    -- Core job information (REQUIRED)
    source varchar(255) NOT NULL,
    title text NOT NULL,
    company text NOT NULL,
    location text NOT NULL,
    url text NOT NULL,
    description text NOT NULL,
    "rawText" text NOT NULL,
    
    -- Date fields (CRITICAL for all queries)
    "datePosted" timestamptz NOT NULL,
    "hoursBackPosted" integer NOT NULL,
    "uploadDate" timestamptz NOT NULL,
    "ingestedAt" timestamptz NOT NULL,
    
    -- Experience and role information
    "yearsExpRequired" text,
    "roleId" text,
    "experience_level" text,
    
    -- Scraping metadata
    "scrapingStatus" varchar(50) NOT NULL,
    "scrapedContentUrl" text,
    "scrapedAt" timestamptz,
    "lastScrapingAttempt" timestamptz,
    "scrapingError" text,
    "reservedAt" timestamptz,
    "reservedBy" text,
    
    -- Additional job details
    "applyType" text,
    industry_type text,
    is_c2c_or_w2 text,
    company_logo_url text,
    posted_by_profile text,
    contract_type text,
    company_url text,
    poster_full_name text,
    salary text,
    work_type text,
    is_staffing text,
    is_sponsored text
);

-- ============================================================================
-- TABLE 2: karmafy_jobrole (ROLE NORMALIZATION TABLE)
-- ============================================================================
-- Used by: Job Listings (for intelligent role grouping)
-- Maps various job titles to standardized role families

CREATE TABLE IF NOT EXISTS public.karmafy_jobrole (
    -- Primary identifier
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    
    -- Standard role name (e.g., "Software Engineer")
    name text NOT NULL,
    
    -- Comma-separated alternate role names
    -- Example: "Backend Developer,Frontend Developer,Full Stack Engineer"
    alternate_roles text,
    
    -- Comma-separated keywords for matching
    -- Example: "javascript,python,react,node.js"
    keywords text,
    
    -- Specific job titles that belong to this role
    "jobTitlesToApplyFor" text,
    
    -- Metadata
    "createdAt" timestamptz NOT NULL DEFAULT NOW(),
    "updatedAt" timestamptz NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE (CRITICAL!)
-- ============================================================================

-- Index 1: Upload Date (Most frequently queried)
-- Used by: ALL APIs for date filtering
CREATE INDEX IF NOT EXISTS idx_karmafy_job_upload_date 
ON public.karmafy_job("uploadDate");

-- Index 2: Company Name (Case-insensitive searches)
-- Used by: Company Heatmap, Company Deep Dive
CREATE INDEX IF NOT EXISTS idx_karmafy_job_company_lower 
ON public.karmafy_job(LOWER(company));

-- Index 3: Date Posted (Time-based filtering)
-- Used by: 24-hour and 7-day aggregations
CREATE INDEX IF NOT EXISTS idx_karmafy_job_date_posted 
ON public.karmafy_job("datePosted");

-- Index 4: Job Title (Role filtering)
-- Used by: Job Listings with role filters
CREATE INDEX IF NOT EXISTS idx_karmafy_job_title 
ON public.karmafy_job(title);

-- Index 5: Composite Index (Upload Date + Company)
-- Used by: Company metrics calculations
CREATE INDEX IF NOT EXISTS idx_karmafy_job_upload_company 
ON public.karmafy_job("uploadDate", company);

-- Index 6: Role name lookup (karmafy_jobrole)
CREATE INDEX IF NOT EXISTS idx_karmafy_jobrole_name_lower 
ON public.karmafy_jobrole(LOWER(name));

-- ============================================================================
-- UPDATE TABLE STATISTICS
-- ============================================================================

ANALYZE public.karmafy_job;
ANALYZE public.karmafy_jobrole;

-- ============================================================================
-- SAMPLE DATA FOR karmafy_jobrole (ROLE DEFINITIONS)
-- ============================================================================
-- Insert standard role definitions for role normalization

INSERT INTO public.karmafy_jobrole (name, alternate_roles, keywords, "jobTitlesToApplyFor", "createdAt", "updatedAt")
VALUES 
  (
    'Software Engineer',
    'Backend Developer,Frontend Developer,Full Stack Developer,Backend Engineer,Frontend Engineer,Full Stack Engineer,Software Developer,Web Developer',
    'javascript,typescript,python,java,react,node.js,angular,vue,spring,django',
    'Software Engineer,Software Developer,Engineer',
    NOW(),
    NOW()
  ),
  (
    'Data Scientist',
    'ML Engineer,Machine Learning Engineer,AI Engineer,Data Analyst,Analytics Engineer',
    'python,tensorflow,pytorch,scikit-learn,machine learning,deep learning,sql,pandas,numpy',
    'Data Scientist,ML Engineer,AI Engineer',
    NOW(),
    NOW()
  ),
  (
    'Product Manager',
    'Product Owner,Senior PM,Technical PM,APM,Associate Product Manager',
    'product management,roadmap,stakeholder,agile,scrum,jira,user stories',
    'Product Manager,Product Owner',
    NOW(),
    NOW()
  ),
  (
    'DevOps Engineer',
    'SRE,Site Reliability Engineer,Platform Engineer,Cloud Engineer,Infrastructure Engineer',
    'kubernetes,docker,aws,azure,gcp,terraform,ansible,jenkins,ci/cd',
    'DevOps Engineer,SRE,Platform Engineer',
    NOW(),
    NOW()
  ),
  (
    'Data Engineer',
    'Big Data Engineer,ETL Developer,Data Platform Engineer',
    'spark,airflow,kafka,sql,python,scala,data pipeline,etl',
    'Data Engineer,ETL Developer',
    NOW(),
    NOW()
  ),
  (
    'UI/UX Designer',
    'Product Designer,UX Designer,UI Designer,Visual Designer,Interaction Designer',
    'figma,sketch,adobe xd,user research,wireframing,prototyping',
    'UI/UX Designer,Product Designer',
    NOW(),
    NOW()
  ),
  (
    'QA Engineer',
    'Test Engineer,Quality Assurance,SDET,Automation Engineer,QA Analyst',
    'selenium,cypress,junit,testng,automation testing,manual testing',
    'QA Engineer,Test Engineer,SDET',
    NOW(),
    NOW()
  ),
  (
    'Security Engineer',
    'Cybersecurity Engineer,InfoSec Engineer,Security Analyst,Penetration Tester',
    'security,penetration testing,threat modeling,siem,firewall',
    'Security Engineer,Cybersecurity Engineer',
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check if tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('karmafy_job', 'karmafy_jobrole');

-- Check indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename IN ('karmafy_job', 'karmafy_jobrole')
ORDER BY tablename, indexname;

-- Check role data
SELECT name, alternate_roles FROM karmafy_jobrole;

-- ============================================================================
-- NEXT STEPS
-- ============================================================================

/*
1. ✅ Run this entire script in Supabase SQL Editor
2. ✅ Verify tables and indexes were created (use verification queries above)
3. ✅ Import your job data into karmafy_job table
4. ✅ Update .env.local with your DATABASE_URL
5. ✅ Test API endpoints
6. ✅ Start the migration!

CONNECTION STRING FORMAT:
postgresql://postgres.molwtyvcjwtxubcahijx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

Get your password from:
https://supabase.com/dashboard/project/molwtyvcjwtxubcahijx/settings/database
*/
