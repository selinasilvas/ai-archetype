-- ─── AI ARCHETYPE QUIZ: SUPABASE SCHEMA ───
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/YOUR_PROJECT/sql)

-- Quiz results (Mode 1: Discover Your Archetype)
CREATE TABLE quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  archetype TEXT NOT NULL,
  runner_up TEXT,
  dim_depth INTEGER,
  dim_breadth INTEGER,
  dim_mode INTEGER,
  dim_relationship INTEGER,
  dim_trust INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Meet Your AI results (Mode 2)
CREATE TABLE meet_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile TEXT NOT NULL,
  runner_up TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE meet_results ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for tracking) but no reads of individual records
CREATE POLICY "Allow anonymous inserts" ON quiz_results
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" ON meet_results
  FOR INSERT TO anon WITH CHECK (true);

-- Allow reading aggregate data only (via RPC function)
CREATE OR REPLACE FUNCTION get_archetype_counts()
RETURNS TABLE (archetype TEXT, count BIGINT) AS $$
  SELECT archetype, COUNT(*) as count
  FROM quiz_results
  GROUP BY archetype
  ORDER BY count DESC;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_profile_counts()
RETURNS TABLE (profile TEXT, count BIGINT) AS $$
  SELECT profile, COUNT(*) as count
  FROM meet_results
  GROUP BY profile
  ORDER BY count DESC;
$$ LANGUAGE sql SECURITY DEFINER;

-- Optional: Allow reading own records for aggregate stats
CREATE POLICY "Allow anonymous reads for aggregation" ON quiz_results
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous reads for aggregation" ON meet_results
  FOR SELECT TO anon USING (true);

-- Indexes for performance
CREATE INDEX idx_quiz_archetype ON quiz_results(archetype);
CREATE INDEX idx_quiz_created ON quiz_results(created_at);
CREATE INDEX idx_meet_profile ON meet_results(profile);
CREATE INDEX idx_meet_created ON meet_results(created_at);
