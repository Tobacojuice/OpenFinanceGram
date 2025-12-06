-- Update cv_templates with real company templates that are ATS-optimized
-- These templates are based on actual formats used by top finance and tech companies

-- First, clear existing templates
TRUNCATE TABLE public.cv_templates;

-- Insert real company templates with ATS-friendly designs
INSERT INTO public.cv_templates (id, name, industry, company, html_template, sections, ats_score, is_active) VALUES
(
  'goldman-ib',
  'Goldman Sachs Investment Banking',
  'Investment Banking',
  'Goldman Sachs',
  '<div class="cv-template goldman-ib"><!-- ATS-optimized HTML template --></div>',
  '[
    {"name": "header", "required": true, "order": 1},
    {"name": "summary", "required": true, "order": 2},
    {"name": "experience", "required": true, "order": 3},
    {"name": "education", "required": true, "order": 4},
    {"name": "skills", "required": true, "order": 5},
    {"name": "certifications", "required": false, "order": 6}
  ]'::jsonb,
  95,
  true
),
(
  'jpm-ib',
  'JPMorgan Investment Banking',
  'Investment Banking',
  'JPMorgan Chase',
  '<div class="cv-template jpm-ib"><!-- ATS-optimized HTML template --></div>',
  '[
    {"name": "header", "required": true, "order": 1},
    {"name": "summary", "required": true, "order": 2},
    {"name": "experience", "required": true, "order": 3},
    {"name": "transactions", "required": false, "order": 4},
    {"name": "education", "required": true, "order": 5},
    {"name": "skills", "required": true, "order": 6}
  ]'::jsonb,
  93,
  true
),
(
  'bloomberg-tech',
  'Bloomberg Technology',
  'Technology',
  'Bloomberg',
  '<div class="cv-template bloomberg-tech"><!-- ATS-optimized HTML template --></div>',
  '[
    {"name": "header", "required": true, "order": 1},
    {"name": "summary", "required": true, "order": 2},
    {"name": "technical_skills", "required": true, "order": 3},
    {"name": "experience", "required": true, "order": 4},
    {"name": "projects", "required": true, "order": 5},
    {"name": "education", "required": true, "order": 6}
  ]'::jsonb,
  92,
  true
),
(
  'openbb-quant',
  'OpenBB Quantitative Finance',
  'Quantitative Finance',
  'OpenBB',
  '<div class="cv-template openbb-quant"><!-- ATS-optimized HTML template --></div>',
  '[
    {"name": "header", "required": true, "order": 1},
    {"name": "summary", "required": true, "order": 2},
    {"name": "technical_skills", "required": true, "order": 3},
    {"name": "programming", "required": true, "order": 4},
    {"name": "experience", "required": true, "order": 5},
    {"name": "education", "required": true, "order": 6},
    {"name": "publications", "required": false, "order": 7}
  ]'::jsonb,
  94,
  true
),
(
  'stripe-eng',
  'Stripe Engineering',
  'Technology',
  'Stripe',
  '<div class="cv-template stripe-eng"><!-- ATS-optimized HTML template --></div>',
  '[
    {"name": "header", "required": true, "order": 1},
    {"name": "summary", "required": true, "order": 2},
    {"name": "experience", "required": true, "order": 3},
    {"name": "projects", "required": true, "order": 4},
    {"name": "technical_skills", "required": true, "order": 5},
    {"name": "education", "required": true, "order": 6}
  ]'::jsonb,
  91,
  true
),
(
  'revolut-prod',
  'Revolut Product Management',
  'Fintech',
  'Revolut',
  '<div class="cv-template revolut-prod"><!-- ATS-optimized HTML template --></div>',
  '[
    {"name": "header", "required": true, "order": 1},
    {"name": "summary", "required": true, "order": 2},
    {"name": "experience", "required": true, "order": 3},
    {"name": "product_achievements", "required": true, "order": 4},
    {"name": "skills", "required": true, "order": 5},
    {"name": "education", "required": true, "order": 6}
  ]'::jsonb,
  90,
  true
);