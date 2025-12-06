export const REGIONS = {
  AMERICA: 'AMERICA',
  EMEA: 'EMEA',
  ASIA: 'ASIA',
  OTHERS: 'OTHERS',
} as const;

export type Region = typeof REGIONS[keyof typeof REGIONS];

export interface University {
  name: string;
  country: string;
  region: Region;
  description: string;
}

export const UNIVERSITIES: University[] = [
  // AMERICA
  { name: 'Harvard University', country: 'USA', region: REGIONS.AMERICA, description: 'Ivy League - Business & Finance' },
  { name: 'Stanford University', country: 'USA', region: REGIONS.AMERICA, description: 'Silicon Valley - Tech & Finance' },
  { name: 'MIT', country: 'USA', region: REGIONS.AMERICA, description: 'Quant Finance & Technology' },
  { name: 'University of Pennsylvania (Wharton)', country: 'USA', region: REGIONS.AMERICA, description: 'Top Finance & Investment Banking' },
  { name: 'Yale University', country: 'USA', region: REGIONS.AMERICA, description: 'Ivy League - Economics & Finance' },
  { name: 'Princeton University', country: 'USA', region: REGIONS.AMERICA, description: 'Ivy League - Economics & Math' },
  { name: 'Columbia University', country: 'USA', region: REGIONS.AMERICA, description: 'NYC - Finance & Business' },
  { name: 'University of Chicago (Booth)', country: 'USA', region: REGIONS.AMERICA, description: 'Economics & Quantitative Finance' },
  { name: 'Northwestern University (Kellogg)', country: 'USA', region: REGIONS.AMERICA, description: 'Marketing & Finance' },
  { name: 'UC Berkeley (Haas)', country: 'USA', region: REGIONS.AMERICA, description: 'Tech & Finance Hub' },
  { name: 'NYU (Stern)', country: 'USA', region: REGIONS.AMERICA, description: 'Wall Street - Finance & Banking' },
  { name: 'Cornell University', country: 'USA', region: REGIONS.AMERICA, description: 'Ivy League - Hotel & Business' },
  { name: 'Duke University (Fuqua)', country: 'USA', region: REGIONS.AMERICA, description: 'Finance & Consulting' },
  { name: 'Dartmouth College (Tuck)', country: 'USA', region: REGIONS.AMERICA, description: 'Investment Banking' },
  { name: 'University of Toronto (Rotman)', country: 'Canada', region: REGIONS.AMERICA, description: 'Canadian Finance Hub' },
  { name: 'McGill University', country: 'Canada', region: REGIONS.AMERICA, description: 'International Business' },
  { name: 'ITAM', country: 'Mexico', region: REGIONS.AMERICA, description: 'Latin American Economics' },
  { name: 'FGV', country: 'Brazil', region: REGIONS.AMERICA, description: 'Brazilian Finance & Economics' },

  // EMEA
  { name: 'London School of Economics (LSE)', country: 'UK', region: REGIONS.EMEA, description: 'Economics & Political Science' },
  { name: 'University of Oxford (Saïd)', country: 'UK', region: REGIONS.EMEA, description: 'Historic Excellence' },
  { name: 'University of Cambridge (Judge)', country: 'UK', region: REGIONS.EMEA, description: 'Quantitative Finance' },
  { name: 'Imperial College London', country: 'UK', region: REGIONS.EMEA, description: 'Financial Engineering' },
  { name: 'INSEAD', country: 'France', region: REGIONS.EMEA, description: 'Global Business School' },
  { name: 'HEC Paris', country: 'France', region: REGIONS.EMEA, description: 'French Elite Business' },
  { name: 'ESCP Business School', country: 'France', region: REGIONS.EMEA, description: 'European Management' },
  { name: 'Bocconi University', country: 'Italy', region: REGIONS.EMEA, description: 'Italian Finance & Economics' },
  { name: 'IE Business School', country: 'Spain', region: REGIONS.EMEA, description: 'Spanish Innovation' },
  { name: 'IESE Business School', country: 'Spain', region: REGIONS.EMEA, description: 'Barcelona Finance Hub' },
  { name: 'Frankfurt School of Finance', country: 'Germany', region: REGIONS.EMEA, description: 'German Banking Center' },
  { name: 'WHU Otto Beisheim', country: 'Germany', region: REGIONS.EMEA, description: 'German Business Excellence' },
  { name: 'Rotterdam School of Management', country: 'Netherlands', region: REGIONS.EMEA, description: 'Dutch Finance' },
  { name: 'Stockholm School of Economics', country: 'Sweden', region: REGIONS.EMEA, description: 'Nordic Finance' },
  { name: 'Copenhagen Business School', country: 'Denmark', region: REGIONS.EMEA, description: 'Scandinavian Business' },
  { name: 'University of St. Gallen', country: 'Switzerland', region: REGIONS.EMEA, description: 'Swiss Banking & Finance' },
  { name: 'Trinity College Dublin', country: 'Ireland', region: REGIONS.EMEA, description: 'Irish Economics' },
  { name: 'University of Cape Town', country: 'South Africa', region: REGIONS.EMEA, description: 'African Markets' },

  // ASIA
  { name: 'National University of Singapore (NUS)', country: 'Singapore', region: REGIONS.ASIA, description: 'Asian Financial Hub' },
  { name: 'INSEAD Singapore', country: 'Singapore', region: REGIONS.ASIA, description: 'Asia-Pacific Business' },
  { name: 'Hong Kong University of Science and Technology (HKUST)', country: 'Hong Kong', region: REGIONS.ASIA, description: 'Finance & Technology' },
  { name: 'Chinese University of Hong Kong (CUHK)', country: 'Hong Kong', region: REGIONS.ASIA, description: 'Chinese Markets' },
  { name: 'Peking University (Guanghua)', country: 'China', region: REGIONS.ASIA, description: 'Chinese Elite Business' },
  { name: 'Tsinghua University', country: 'China', region: REGIONS.ASIA, description: 'Tech & Finance in China' },
  { name: 'University of Tokyo', country: 'Japan', region: REGIONS.ASIA, description: 'Japanese Economics' },
  { name: 'Waseda University', country: 'Japan', region: REGIONS.ASIA, description: 'Tokyo Finance' },
  { name: 'Seoul National University', country: 'South Korea', region: REGIONS.ASIA, description: 'Korean Business' },
  { name: 'KAIST', country: 'South Korea', region: REGIONS.ASIA, description: 'Tech & Finance' },
  { name: 'Indian Institute of Management Ahmedabad (IIMA)', country: 'India', region: REGIONS.ASIA, description: 'Indian Business Elite' },
  { name: 'Indian Institute of Management Bangalore (IIMB)', country: 'India', region: REGIONS.ASIA, description: 'Tech & Finance in India' },
  { name: 'Indian School of Business (ISB)', country: 'India', region: REGIONS.ASIA, description: 'Hyderabad Business Hub' },

  // OTHERS
  { name: 'Australian National University', country: 'Australia', region: REGIONS.OTHERS, description: 'Australian Economics' },
  { name: 'University of Melbourne', country: 'Australia', region: REGIONS.OTHERS, description: 'Melbourne Finance' },
  { name: 'University of Sydney', country: 'Australia', region: REGIONS.OTHERS, description: 'Sydney Business' },
  { name: 'University of Auckland', country: 'New Zealand', region: REGIONS.OTHERS, description: 'Pacific Business' },
];

export const getUniversitiesByRegion = (region: Region) => 
  UNIVERSITIES.filter(u => u.region === region);

export const getAllRegions = () => Object.values(REGIONS);
