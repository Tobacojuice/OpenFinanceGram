-- Add job alerts table for personalized job recommendations
CREATE TABLE IF NOT EXISTS job_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  job_url TEXT,
  source TEXT CHECK (source IN ('linkedin', 'aiapply', 'manual', 'handshake')) DEFAULT 'manual',
  match_score NUMERIC(5,2) DEFAULT 0,
  status TEXT CHECK (status IN ('new', 'viewed', 'applied', 'saved', 'rejected')) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  applied_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id, job_url)
);

-- Enable RLS
ALTER TABLE job_alerts ENABLE ROW LEVEL SECURITY;

-- Policies for job_alerts
CREATE POLICY "Users can view own job alerts" 
  ON job_alerts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own job alerts" 
  ON job_alerts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own job alerts" 
  ON job_alerts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own job alerts" 
  ON job_alerts FOR DELETE 
  USING (auth.uid() = user_id);

-- Add linkedin connection fields to existing jobsea_profiles
ALTER TABLE jobsea_profiles 
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_connected BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS experience_level TEXT CHECK (experience_level IN ('Internship', 'Entry', 'Mid', 'Senior', 'Executive')),
  ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS certifications TEXT[] DEFAULT '{}';

-- Function to calculate match score for jobs
CREATE OR REPLACE FUNCTION calculate_job_match_score(
  p_job_title TEXT,
  p_company TEXT,
  p_location TEXT,
  p_user_branches TEXT[],
  p_user_geography TEXT
)
RETURNS NUMERIC AS $$
DECLARE
  score NUMERIC := 0.5;
BEGIN
  -- Match on job title keywords
  IF p_job_title ILIKE ANY(ARRAY['%analyst%', '%associate%', '%banker%', '%trader%', '%quant%']) THEN
    score := score + 0.2;
  END IF;
  
  -- Match on geography
  IF p_location ILIKE '%' || p_user_geography || '%' THEN
    score := score + 0.15;
  END IF;
  
  -- Match on branches/industry
  IF p_job_title ILIKE ANY(SELECT '%' || unnest(p_user_branches) || '%') OR
     p_company ILIKE ANY(SELECT '%' || unnest(p_user_branches) || '%') THEN
    score := score + 0.15;
  END IF;
  
  RETURN LEAST(1.0, score);
END;
$$ LANGUAGE plpgsql IMMUTABLE;