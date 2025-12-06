-- Fix function search path security issue
CREATE OR REPLACE FUNCTION calculate_job_match_score(
  p_job_title TEXT,
  p_company TEXT,
  p_location TEXT,
  p_user_branches TEXT[],
  p_user_geography TEXT
)
RETURNS NUMERIC 
LANGUAGE plpgsql 
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;