-- Create table for storing analyzed bank reports
CREATE TABLE public.bank_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bank_name TEXT NOT NULL,
  report_type TEXT NOT NULL,
  report_year INTEGER NOT NULL,
  report_quarter TEXT,
  report_url TEXT NOT NULL,
  report_title TEXT NOT NULL,
  analysis JSON NOT NULL,
  key_insights TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bank_reports ENABLE ROW LEVEL SECURITY;

-- Everyone can read reports (public data)
CREATE POLICY "Reports are viewable by everyone" 
ON public.bank_reports 
FOR SELECT 
USING (true);

-- Add trigger for timestamps
CREATE TRIGGER update_bank_reports_updated_at
BEFORE UPDATE ON public.bank_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_bank_reports_bank_name ON public.bank_reports(bank_name);
CREATE INDEX idx_bank_reports_year ON public.bank_reports(report_year DESC);
CREATE INDEX idx_bank_reports_type ON public.bank_reports(report_type);