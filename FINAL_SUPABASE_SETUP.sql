-- ============================================================================
-- SUPABASE DATABASE SETUP - FINAL VERSION
-- Copy this ENTIRE script and paste into Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- TABLE 1: karmafy_job (JOB POSTINGS - YOUR EXACT SCHEMA)
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
-- TABLE 2: karmafy_jobrole (ROLE DEFINITIONS - YOUR EXACT SCHEMA)
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

-- Index 1: Upload Date (most queried field)
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

-- Index 5: Composite (upload date + company)
CREATE INDEX IF NOT EXISTS idx_karmafy_job_upload_company 
ON public.karmafy_job("uploadDate", company);

-- Index 6: Role name lookup
CREATE INDEX IF NOT EXISTS idx_karmafy_jobrole_name 
ON public.karmafy_jobrole(name);

-- ============================================================================
-- SAMPLE ROLE DATA (Role Normalization Definitions)
-- ============================================================================

INSERT INTO public.karmafy_jobrole (name, alternate_roles, keywords, "jobTitlesToApplyFor", "createdAt", "updatedAt")
VALUES 
  -- Software Engineering Roles
  (
    'Software Engineer',
    'Backend Developer,Frontend Developer,Full Stack Developer,Backend Engineer,Frontend Engineer,Full Stack Engineer,Software Developer,Web Developer,Application Developer',
    'javascript,typescript,python,java,react,node.js,angular,vue,spring,django,c++,golang',
    'Software Engineer,Software Developer,Engineer,Developer',
    NOW(),
    NOW()
  ),
  
  -- Data Science & ML
  (
    'Data Scientist',
    'ML Engineer,Machine Learning Engineer,AI Engineer,Data Analyst,Analytics Engineer,Research Scientist',
    'python,tensorflow,pytorch,scikit-learn,machine learning,deep learning,sql,pandas,numpy,r,statistics',
    'Data Scientist,ML Engineer,AI Engineer',
    NOW(),
    NOW()
  ),
  
  -- Product Management
  (
    'Product Manager',
    'Product Owner,Senior PM,Technical PM,APM,Associate Product Manager,Group Product Manager',
    'product management,roadmap,stakeholder,agile,scrum,jira,user stories,product strategy',
    'Product Manager,Product Owner,PM',
    NOW(),
    NOW()
  ),
  
  -- DevOps & Infrastructure
  (
    'DevOps Engineer',
    'SRE,Site Reliability Engineer,Platform Engineer,Cloud Engineer,Infrastructure Engineer,Systems Engineer',
    'kubernetes,docker,aws,azure,gcp,terraform,ansible,jenkins,ci/cd,cloudformation',
    'DevOps Engineer,SRE,Platform Engineer,Cloud Engineer',
    NOW(),
    NOW()
  ),
  
  -- Data Engineering
  (
    'Data Engineer',
    'Big Data Engineer,ETL Developer,Data Platform Engineer,Data Warehouse Engineer',
    'spark,airflow,kafka,sql,python,scala,data pipeline,etl,snowflake,redshift,databricks',
    'Data Engineer,ETL Developer,Big Data Engineer',
    NOW(),
    NOW()
  ),
  
  -- Design
  (
    'UI/UX Designer',
    'Product Designer,UX Designer,UI Designer,Visual Designer,Interaction Designer,Experience Designer',
    'figma,sketch,adobe xd,user research,wireframing,prototyping,design systems',
    'UI/UX Designer,Product Designer,UX Designer',
    NOW(),
    NOW()
  ),
  
  -- Quality Assurance
  (
    'QA Engineer',
    'Test Engineer,Quality Assurance,SDET,Automation Engineer,QA Analyst,Test Automation Engineer',
    'selenium,cypress,junit,testng,automation testing,manual testing,test plans',
    'QA Engineer,Test Engineer,SDET',
    NOW(),
    NOW()
  ),
  
  -- Security
  (
    'Security Engineer',
    'Cybersecurity Engineer,InfoSec Engineer,Security Analyst,Penetration Tester,AppSec Engineer',
    'security,penetration testing,threat modeling,siem,firewall,vulnerability assessment',
    'Security Engineer,Cybersecurity Engineer,InfoSec',
    NOW(),
    NOW()
  ),
  
  -- Mobile Development
  (
    'Mobile Developer',
    'iOS Developer,Android Developer,Mobile Engineer,React Native Developer,Flutter Developer',
    'swift,kotlin,java,react native,flutter,ios,android,mobile app',
    'Mobile Developer,iOS Developer,Android Developer',
    NOW(),
    NOW()
  ),
  
  -- Business Intelligence
  (
    'Business Intelligence Analyst',
    'BI Analyst,Data Analyst,Analytics Analyst,Reporting Analyst',
    'tableau,power bi,sql,looker,data visualization,reporting,dashboards',
    'BI Analyst,Business Analyst,Data Analyst',
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- UPDATE STATISTICS FOR QUERY OPTIMIZER
-- ============================================================================

ANALYZE public.karmafy_job;
ANALYZE public.karmafy_jobrole;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- 1. Check tables exist
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('karmafy_job', 'karmafy_jobrole');

-- 2. Check indexes
SELECT tablename, indexname
FROM pg_indexes
WHERE tablename IN ('karmafy_job', 'karmafy_jobrole')
ORDER BY tablename, indexname;

-- 3. Verify role data
SELECT 
    name,
    alternate_roles,
    "createdAt"
FROM karmafy_jobrole
ORDER BY name;

-- 4. Check if karmafy_job has data
SELECT 
    COUNT(*) as total_jobs,
    COUNT(DISTINCT company) as total_companies,
    MIN("uploadDate"::date) as earliest_date,
    MAX("uploadDate"::date) as latest_date
FROM karmafy_job;

-- ============================================================================
-- SUCCESS!
-- ============================================================================
-- ✅ Tables created
-- ✅ Indexes added
-- ✅ Sample role data inserted
-- 
-- NEXT STEPS:
-- 1. Import your job data into karmafy_job (if not already present)
-- 2. Get your DATABASE_URL from Supabase settings
-- 3. Add to .env.local
-- 4. Test APIs!
-- ============================================================================
