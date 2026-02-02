-- Additional indexes for karmafy_jobrole table
-- Optimizes role lookups and keyword searches

-- Index for role name lookups (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_karmafy_jobrole_name_lower 
ON public.karmafy_jobrole(LOWER(name));

-- Full-text search index for keywords (for intelligent role matching)
CREATE INDEX IF NOT EXISTS idx_karmafy_jobrole_keywords_fts
ON public.karmafy_jobrole USING gin(to_tsvector('english', keywords));

-- Update statistics
ANALYZE public.karmafy_jobrole;
