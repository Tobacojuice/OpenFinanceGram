// Core TypeScript types for the application

export interface CVData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications: string[];
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
}

export interface SavedCV {
  id: string;
  user_id: string;
  template: string;
  payload: CVData;
  ats_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface CertificateProgress {
  id: string;
  user_id: string;
  certificate: string;
  status: 'planning' | 'studying' | 'scheduled' | 'passed' | 'failed';
  exam_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  sector: string;
  geography: string;
  linkedin_url: string;
  logo: string | null;
  headcount: number;
  open_jobs: number;
  hiring_velocity: number;
  glassdoor_rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface Voice {
  id: string;
  name: string;
  title: string;
  company: string;
  linkedin_id: string;
  avatar_url: string | null;
  followers: number;
  engagement_30d: number;
  last_post_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  voice_id: string;
  post_url: string;
  post_content: string;
  engagement_stats: Record<string, unknown> | null;
  sentiment: string | null;
  is_read: boolean;
  created_at: string;
  jobsea_voices?: Voice;
}

export interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changesPercentage: number;
  volume: number;
  marketCap: number;
}

export interface SectorData {
  sector: string;
  changesPercentage: string;
}

export interface HistoricalData {
  date: string;
  close: number;
  volume?: number;
}

export interface CompanyProfile {
  symbol: string;
  companyName: string;
  price: number;
  sector: string;
  industry: string;
  website: string;
  description: string;
  ceo: string;
  employees: number;
  city: string;
  state: string;
  country: string;
  marketCap: number;
}

export interface ExecutiveData {
  name: string;
  title: string;
  pay?: number;
  currencyPay?: string;
}

export interface FinancialData {
  revenue: number;
  netIncome: number;
  eps: number;
  peRatio: number;
  [key: string]: unknown;
}

export interface NewsItem {
  title: string;
  link: string;
  publisher?: string;
  providerPublishTime?: string;
  thumbnail?: {
    resolutions?: Array<{ url: string }>;
  };
}

export interface KeyMetric {
  date: string;
  symbol: string;
  [key: string]: unknown;
}

export interface AnalystRating {
  symbol: string;
  date: string;
  rating: string;
  targetPrice: number;
  [key: string]: unknown;
}

export interface OptionData {
  contractSymbol: string;
  strike: number;
  lastPrice: number;
  change: number;
  percentChange: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
}

export interface InsiderTrade {
  filingDate: string;
  transactionDate: string;
  reportingName: string;
  transactionType: string;
  securitiesOwned: number;
  securitiesTransacted: number;
  price: number;
}

export interface SECFiling {
  symbol: string;
  cik: string;
  type: string;
  date: string;
  link: string;
}

export interface InstitutionalHolder {
  holder: string;
  shares: number;
  dateReported: string;
  percentHeld: number;
  value: number;
}

export interface TechnicalIndicator {
  date: string;
  value: number;
  indicator: string;
}

export interface EconomicEvent {
  date: string;
  event: string;
  country: string;
  actual: number | null;
  estimate: number | null;
  previous: number | null;
  impact: 'low' | 'medium' | 'high';
}

export interface CommodityData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}
