export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  fontFamily: string;
  fontSize: {
    name: string;
    headers: string;
    companies: string;
    body: string;
    metadata: string;
  };
  lineHeight: string;
  margins: string;
  pageLimit: number;
  sections: string[];
  colors: {
    primary: string;
  };
}

export const templates: Record<string, CVTemplate> = {
  'goldman-ib': {
    id: 'goldman-ib',
    name: 'Goldman Sachs (Investment Banking)',
    description: 'Traditional bulge bracket format - Black text, Times New Roman, 1 page',
    fontFamily: `'Crimson Text', 'Times New Roman', serif`,
    fontSize: {
      name: '20px',
      headers: '12px',
      companies: '11px',
      body: '10px',
      metadata: '10px',
    },
    lineHeight: '1.15',
    margins: '0.6in',
    pageLimit: 1,
    sections: ['Education', 'Experience', 'Skills & Interests'],
    colors: { primary: '#000000' },
  },

  'jpm-ib': {
    id: 'jpm-ib',
    name: 'JPMorgan (Investment Banking)',
    description: 'Classic Wall Street format with deal emphasis - 1 page mandatory',
    fontFamily: `'Crimson Text', 'Times New Roman', serif`,
    fontSize: {
      name: '20px',
      headers: '12px',
      companies: '11px',
      body: '10px',
      metadata: '10px',
    },
    lineHeight: '1.15',
    margins: '0.5in',
    pageLimit: 1,
    sections: ['Education', 'Experience', 'Additional Information'],
    colors: { primary: '#000000' },
  },

  'openbb-quant': {
    id: 'openbb-quant',
    name: 'OpenBB (Quantitative Finance)',
    description: 'Quant-focused with emphasis on technical skills and research',
    fontFamily: `'Crimson Text', 'Times New Roman', serif`,
    fontSize: {
      name: '20px',
      headers: '12px',
      companies: '11px',
      body: '10px',
      metadata: '10px',
    },
    lineHeight: '1.15',
    margins: '0.65in',
    pageLimit: 1,
    sections: ['Education', 'Research Experience', 'Technical Skills', 'Publications'],
    colors: { primary: '#000000' },
  },

  'bloomberg-tech': {
    id: 'bloomberg-tech',
    name: 'Bloomberg (Technology)',
    description: 'Tech-focused highlighting projects and skills - 2 pages allowed',
    fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`,
    fontSize: {
      name: '22px',
      headers: '13px',
      companies: '12px',
      body: '11px',
      metadata: '11px',
    },
    lineHeight: '1.35',
    margins: '0.7in',
    pageLimit: 2,
    sections: ['Professional Summary', 'Technical Experience', 'Projects', 'Education', 'Skills'],
    colors: { primary: '#1a1a1a' },
  },

  'stripe-eng': {
    id: 'stripe-eng',
    name: 'Stripe (Engineering)',
    description: 'Clean, project-focused format for engineers - 2 pages',
    fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`,
    fontSize: {
      name: '24px',
      headers: '14px',
      companies: '13px',
      body: '11px',
      metadata: '11px',
    },
    lineHeight: '1.4',
    margins: '0.75in',
    pageLimit: 2,
    sections: ['Summary', 'Experience', 'Projects', 'Skills', 'Education'],
    colors: { primary: '#1a1a1a' },
  },

  'revolut-prod': {
    id: 'revolut-prod',
    name: 'Revolut (Product)',
    description: 'Product-focused with metrics and impact - 2 pages',
    fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`,
    fontSize: {
      name: '22px',
      headers: '13px',
      companies: '12px',
      body: '11px',
      metadata: '11px',
    },
    lineHeight: '1.35',
    margins: '0.7in',
    pageLimit: 2,
    sections: ['Summary', 'Product Experience', 'Key Achievements', 'Education', 'Skills'],
    colors: { primary: '#1a1a1a' },
  },
};
