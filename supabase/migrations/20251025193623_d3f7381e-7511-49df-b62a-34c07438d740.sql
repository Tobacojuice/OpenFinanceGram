-- JobSea™ Database Schema
-- Users already exist via auth.users, extend with profiles

-- JobSea user preferences
CREATE TABLE IF NOT EXISTS public.jobsea_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dream_job TEXT NOT NULL,
  realistic_job TEXT NOT NULL,
  worst_job TEXT NOT NULL,
  branches TEXT[] NOT NULL,
  geography TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Companies database
CREATE TABLE IF NOT EXISTS public.jobsea_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  linkedin_url TEXT NOT NULL,
  logo TEXT,
  sector TEXT NOT NULL,
  headcount INTEGER NOT NULL,
  open_jobs INTEGER NOT NULL,
  glassdoor_rating DECIMAL(3,2),
  hiring_velocity DECIMAL(5,2) NOT NULL,
  geography TEXT NOT NULL,
  added_by TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Industry voices/influencers
CREATE TABLE IF NOT EXISTS public.jobsea_voices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  linkedin_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  avatar_url TEXT,
  followers INTEGER NOT NULL,
  engagement_30d DECIMAL(5,2) NOT NULL,
  last_post_at TIMESTAMPTZ,
  users TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User watchlists
CREATE TABLE IF NOT EXISTS public.jobsea_user_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.jobsea_companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, company_id)
);

-- User followed voices
CREATE TABLE IF NOT EXISTS public.jobsea_user_voices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  voice_id UUID NOT NULL REFERENCES public.jobsea_voices(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, voice_id)
);

-- CV storage
CREATE TABLE IF NOT EXISTS public.jobsea_cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template TEXT NOT NULL,
  payload JSONB NOT NULL,
  s3_key TEXT,
  ats_score DECIMAL(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Certificate progress tracking
CREATE TABLE IF NOT EXISTS public.jobsea_cert_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certificate TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('not_started', 'enrolled', 'passed')),
  exam_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, certificate)
);

-- Voice notifications/posts
CREATE TABLE IF NOT EXISTS public.jobsea_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voice_id UUID NOT NULL REFERENCES public.jobsea_voices(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_content TEXT NOT NULL,
  post_url TEXT NOT NULL,
  sentiment TEXT,
  engagement_stats JSONB,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.jobsea_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobsea_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobsea_voices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobsea_user_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobsea_user_voices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobsea_cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobsea_cert_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobsea_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for jobsea_profiles
CREATE POLICY "Users can view their own profile"
  ON public.jobsea_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.jobsea_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.jobsea_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for companies (public read, authenticated write)
CREATE POLICY "Anyone can view companies"
  ON public.jobsea_companies FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert companies"
  ON public.jobsea_companies FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for voices (public read)
CREATE POLICY "Anyone can view voices"
  ON public.jobsea_voices FOR SELECT
  USING (true);

-- RLS Policies for user_companies
CREATE POLICY "Users can view their own watchlist"
  ON public.jobsea_user_companies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their watchlist"
  ON public.jobsea_user_companies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their watchlist"
  ON public.jobsea_user_companies FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for user_voices
CREATE POLICY "Users can view their followed voices"
  ON public.jobsea_user_voices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can follow voices"
  ON public.jobsea_user_voices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unfollow voices"
  ON public.jobsea_user_voices FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for CVs
CREATE POLICY "Users can view their own CVs"
  ON public.jobsea_cvs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own CVs"
  ON public.jobsea_cvs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CVs"
  ON public.jobsea_cvs FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for certificate progress
CREATE POLICY "Users can view their own cert progress"
  ON public.jobsea_cert_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cert progress"
  ON public.jobsea_cert_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cert progress"
  ON public.jobsea_cert_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON public.jobsea_notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.jobsea_notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_jobsea_profiles_updated_at
  BEFORE UPDATE ON public.jobsea_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobsea_companies_updated_at
  BEFORE UPDATE ON public.jobsea_companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobsea_voices_updated_at
  BEFORE UPDATE ON public.jobsea_voices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobsea_cvs_updated_at
  BEFORE UPDATE ON public.jobsea_cvs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobsea_cert_progress_updated_at
  BEFORE UPDATE ON public.jobsea_cert_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_jobsea_profiles_user_id ON public.jobsea_profiles(user_id);
CREATE INDEX idx_jobsea_companies_sector ON public.jobsea_companies(sector);
CREATE INDEX idx_jobsea_companies_geography ON public.jobsea_companies(geography);
CREATE INDEX idx_jobsea_user_companies_user_id ON public.jobsea_user_companies(user_id);
CREATE INDEX idx_jobsea_user_voices_user_id ON public.jobsea_user_voices(user_id);
CREATE INDEX idx_jobsea_cvs_user_id ON public.jobsea_cvs(user_id);
CREATE INDEX idx_jobsea_cert_progress_user_id ON public.jobsea_cert_progress(user_id);
CREATE INDEX idx_jobsea_notifications_user_id ON public.jobsea_notifications(user_id);
CREATE INDEX idx_jobsea_notifications_is_read ON public.jobsea_notifications(is_read);