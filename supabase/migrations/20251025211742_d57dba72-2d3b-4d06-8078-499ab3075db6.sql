-- LinkedIn Public Profile Scraper Tables
-- Store scraped public LinkedIn profile data (users manually input URLs)

-- Table for storing public LinkedIn profiles
CREATE TABLE IF NOT EXISTS public.jobsea_linkedin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  linkedin_url TEXT NOT NULL,
  public_identifier TEXT,
  first_name TEXT,
  last_name TEXT,
  headline TEXT,
  location TEXT,
  connections_count INTEGER,
  followers_count INTEGER,
  summary TEXT,
  profile_image_url TEXT,
  experience JSONB DEFAULT '[]'::jsonb,
  education JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  scraped_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, linkedin_url)
);

-- Table for tracking scrape requests and rate limiting
CREATE TABLE IF NOT EXISTS public.jobsea_linkedin_scrapes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  linkedin_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'rate_limited')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.jobsea_linkedin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobsea_linkedin_scrapes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for jobsea_linkedin_profiles
CREATE POLICY "Users can view their own LinkedIn profiles"
  ON public.jobsea_linkedin_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own LinkedIn profiles"
  ON public.jobsea_linkedin_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own LinkedIn profiles"
  ON public.jobsea_linkedin_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own LinkedIn profiles"
  ON public.jobsea_linkedin_profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for jobsea_linkedin_scrapes
CREATE POLICY "Users can view their own scrape requests"
  ON public.jobsea_linkedin_scrapes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scrape requests"
  ON public.jobsea_linkedin_scrapes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_linkedin_profiles_user_id ON public.jobsea_linkedin_profiles(user_id);
CREATE INDEX idx_linkedin_profiles_public_identifier ON public.jobsea_linkedin_profiles(public_identifier);
CREATE INDEX idx_linkedin_scrapes_user_id ON public.jobsea_linkedin_scrapes(user_id);
CREATE INDEX idx_linkedin_scrapes_status ON public.jobsea_linkedin_scrapes(status);
CREATE INDEX idx_linkedin_scrapes_created_at ON public.jobsea_linkedin_scrapes(created_at);

-- Trigger for updated_at
CREATE TRIGGER update_linkedin_profiles_updated_at
  BEFORE UPDATE ON public.jobsea_linkedin_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check daily rate limit (max 10 scrapes per user per day)
CREATE OR REPLACE FUNCTION public.check_linkedin_scrape_rate_limit(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  scrape_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO scrape_count
  FROM public.jobsea_linkedin_scrapes
  WHERE user_id = p_user_id
    AND created_at > now() - INTERVAL '24 hours';
  
  RETURN scrape_count < 10;
END;
$$;