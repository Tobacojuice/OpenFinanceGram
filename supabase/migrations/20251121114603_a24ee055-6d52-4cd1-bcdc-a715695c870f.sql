-- Add additional fields to jobsea_profiles for expanded quiz
ALTER TABLE public.jobsea_profiles 
ADD COLUMN IF NOT EXISTS work_experience TEXT,
ADD COLUMN IF NOT EXISTS education TEXT,
ADD COLUMN IF NOT EXISTS financial_goals TEXT,
ADD COLUMN IF NOT EXISTS career_stage TEXT;