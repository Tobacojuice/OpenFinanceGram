-- Add latitude and longitude columns to universities table
ALTER TABLE public.universities 
ADD COLUMN IF NOT EXISTS latitude decimal(10, 7),
ADD COLUMN IF NOT EXISTS longitude decimal(10, 7);