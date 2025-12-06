-- Create table for university platforms
CREATE TABLE IF NOT EXISTS public.user_university_platforms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  university_name TEXT NOT NULL,
  platform_url TEXT NOT NULL,
  is_supported BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_university_platforms ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own platform"
  ON public.user_university_platforms FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own platform"
  ON public.user_university_platforms FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own platform"
  ON public.user_university_platforms FOR UPDATE
  USING (auth.uid() = user_id);