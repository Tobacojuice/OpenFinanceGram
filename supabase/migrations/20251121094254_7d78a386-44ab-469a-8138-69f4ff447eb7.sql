-- Create universities table with real data
CREATE TABLE IF NOT EXISTS public.universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT NOT NULL CHECK (region IN ('AMERICA', 'EMEA', 'ASIA', 'OTHERS')),
  domain TEXT,
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE,
  student_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert REAL universities by region
INSERT INTO public.universities (name, country, region, domain) VALUES
-- AMERICA
('Harvard University', 'USA', 'AMERICA', 'harvard.edu'),
('Stanford University', 'USA', 'AMERICA', 'stanford.edu'),
('University of Pennsylvania', 'USA', 'AMERICA', 'upenn.edu'),
('MIT', 'USA', 'AMERICA', 'mit.edu'),
('University of Chicago', 'USA', 'AMERICA', 'uchicago.edu'),
('University of Toronto', 'Canada', 'AMERICA', 'utoronto.ca'),
('UBC', 'Canada', 'AMERICA', 'ubc.ca'),
('ITAM', 'Mexico', 'AMERICA', 'itam.mx'),
('University of São Paulo', 'Brazil', 'AMERICA', 'usp.br'),

-- EMEA
('London School of Economics', 'UK', 'EMEA', 'lse.ac.uk'),
('University of Oxford', 'UK', 'EMEA', 'ox.ac.uk'),
('University of Cambridge', 'UK', 'EMEA', 'cam.ac.uk'),
('HEC Paris', 'France', 'EMEA', 'hec.fr'),
('INSEAD', 'France', 'EMEA', 'insead.edu'),
('London Business School', 'UK', 'EMEA', 'london.edu'),
('IE Business School', 'Spain', 'EMEA', 'ie.edu'),
('Bocconi University', 'Italy', 'EMEA', 'unibocconi.it'),

-- ASIA
('National University of Singapore', 'Singapore', 'ASIA', 'nus.edu.sg'),
('Nanyang Technological University', 'Singapore', 'ASIA', 'ntu.edu.sg'),
('University of Tokyo', 'Japan', 'ASIA', 'u-tokyo.ac.jp'),
('Tsinghua University', 'China', 'ASIA', 'tsinghua.edu.cn'),
('Peking University', 'China', 'ASIA', 'pku.edu.cn'),
('HKU', 'Hong Kong', 'ASIA', 'hku.hk'),
('HKUST', 'Hong Kong', 'ASIA', 'ust.hk'),
('Indian Institute of Management', 'India', 'ASIA', 'iim.ac.in'),

-- OTHERS
('University of Melbourne', 'Australia', 'OTHERS', 'unimelb.edu.au'),
('University of Sydney', 'Australia', 'OTHERS', 'sydney.edu.au'),
('University of Cape Town', 'South Africa', 'OTHERS', 'uct.ac.za');

-- Create function to ensure each university has a channel
CREATE OR REPLACE FUNCTION public.create_university_channel()
RETURNS TRIGGER AS $$
DECLARE
  new_channel_id UUID;
BEGIN
  IF NEW.channel_id IS NULL THEN
    INSERT INTO public.channels (name, description, type)
    VALUES (
      'university_' || LOWER(REPLACE(NEW.name, ' ', '_')),
      NEW.name || ' (' || NEW.country || ')',
      'university'
    )
    RETURNING id INTO new_channel_id;
    
    NEW.channel_id := new_channel_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER create_university_channel_trigger
  BEFORE INSERT ON public.universities
  FOR EACH ROW EXECUTE FUNCTION public.create_university_channel();

-- For existing universities, create channels manually
DO $$
DECLARE
  uni RECORD;
  chan_id UUID;
BEGIN
  FOR uni IN SELECT * FROM public.universities WHERE channel_id IS NULL LOOP
    INSERT INTO public.channels (name, description, type)
    VALUES (
      'university_' || LOWER(REPLACE(uni.name, ' ', '_')),
      uni.name || ' (' || uni.country || ')',
      'university'
    )
    RETURNING id INTO chan_id;
    
    UPDATE public.universities SET channel_id = chan_id WHERE id = uni.id;
  END LOOP;
END $$;

-- Enable RLS
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view universities" ON public.universities FOR SELECT USING (true);

-- Add search index
CREATE INDEX idx_universities_name ON public.universities USING gin (to_tsvector('english', name));
CREATE INDEX idx_universities_country ON public.universities (country);
CREATE INDEX idx_universities_region ON public.universities (region);

-- Function to search universities
CREATE OR REPLACE FUNCTION public.search_universities(search_term TEXT, region_filter TEXT DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  name TEXT,
  country TEXT,
  region TEXT,
  channel_id UUID,
  student_count INT,
  match_score REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.name,
    u.country,
    u.region,
    u.channel_id,
    u.student_count,
    ts_rank(to_tsvector('english', u.name || ' ' || u.country), plainto_tsquery('english', search_term)) as match_score
  FROM public.universities u
  WHERE (search_term = '' OR 
         u.name ILIKE '%' || search_term || '%' OR 
         u.country ILIKE '%' || search_term || '%')
    AND (region_filter IS NULL OR u.region = region_filter)
  ORDER BY match_score DESC, u.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;