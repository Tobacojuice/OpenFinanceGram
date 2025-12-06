// API client using Supabase Cloud functions
import { supabase } from "@/integrations/supabase/client";

export const apiClient = {
  fetchNews: async (symbols: string[] = [], limit: number = 50) => {
    const { data, error } = await supabase.functions.invoke('fetch-news', { body: { symbols, limit } });
    if (error) throw error;
    return data;
  },

  fetchCryptoData: async () => {
    const { data, error } = await supabase.functions.invoke('fetch-crypto-data');
    if (error) throw error;
    return data;
  },

  fetchMarketData: async (symbols: string[]) => {
    const { data, error } = await supabase.functions.invoke('fetch-market-data', { body: { symbols } });
    if (error) throw error;
    return data;
  },

  fetchCompanyProfile: async (symbol: string) => {
    const { data, error } = await supabase.functions.invoke('fetch-company-profile', { body: { symbol } });
    if (error) throw error;
    return data;
  },

  fetchStockHistorical: async (symbol: string, range: string = '6mo') => {
    const { data, error } = await supabase.functions.invoke('fetch-stock-historical', { body: { symbol, range } });
    if (error) throw error;
    return data;
  },

  fetchCompanyFinancials: async (symbol: string) => {
    const { data, error } = await supabase.functions.invoke('fetch-company-financials', { body: { symbol } });
    if (error) throw error;
    return data;
  },

  fetchCompanyNews: async (symbol: string) => {
    const { data, error } = await supabase.functions.invoke('fetch-company-news', { body: { symbol } });
    if (error) throw error;
    return data;
  },

  fetchTechnicalIndicators: async (symbol: string, indicator: string = 'sma', period: number = 20, interval: string = '1day') => {
    const { data, error } = await supabase.functions.invoke('fetch-technical-indicators', { 
      body: { symbol, indicator, period, interval } 
    });
    if (error) throw error;
    return data;
  },

  fetchEconomicCalendar: async (from: string, to: string) => {
    const { data, error } = await supabase.functions.invoke('fetch-economic-calendar', { body: { from, to } });
    if (error) throw error;
    return data;
  },

  fetchMarketSectors: async () => {
    const { data, error } = await supabase.functions.invoke('fetch-market-sectors');
    if (error) throw error;
    return data;
  },

  fetchStockScreener: async (filters: any) => {
    const { data, error } = await supabase.functions.invoke('fetch-stock-screener', { body: filters });
    if (error) throw error;
    return data;
  },

  fetchEsgScores: async (symbol: string) => {
    const { data, error } = await supabase.functions.invoke('fetch-esg-scores', { body: { symbol } });
    if (error) throw error;
    return data;
  },

  fetchGovernance: async (symbol: string) => {
    const { data, error } = await supabase.functions.invoke('fetch-governance', { body: { symbol } });
    if (error) throw error;
    return data;
  },

  fetchAnalystEstimates: async (symbol: string) => {
    const { data, error } = await supabase.functions.invoke('fetch-analyst-estimates', { body: { symbol } });
    if (error) throw error;
    return data;
  },

  fetchInsiderTrades: async (symbol: string) => {
    const { data, error } = await supabase.functions.invoke('fetch-insider-trades', { body: { symbol } });
    if (error) throw error;
    return data;
  },

  fetchInstitutionalHolders: async (symbol: string) => {
    const { data, error } = await supabase.functions.invoke('fetch-institutional-holders', { body: { symbol } });
    if (error) throw error;
    return data;
  },

  fetchDividendHistory: async (symbol: string) => {
    const { data, error } = await supabase.functions.invoke('fetch-dividend-history', { body: { symbol } });
    if (error) throw error;
    return data;
  },

  fetchEarningsHistory: async (symbol: string) => {
    const { data, error } = await supabase.functions.invoke('fetch-earnings-history', { body: { symbol } });
    if (error) throw error;
    return data;
  },

  fetchSecFilings: async (symbol: string) => {
    const { data, error } = await supabase.functions.invoke('fetch-sec-filings', { body: { symbol } });
    if (error) throw error;
    return data;
  },

  fetchPriceTargets: async (symbol: string) => {
    const { data, error } = await supabase.functions.invoke('fetch-price-targets', { body: { symbol } });
    if (error) throw error;
    return data;
  },

  fetchPeers: async (symbol: string) => {
    const { data, error } = await supabase.functions.invoke('fetch-peers', { body: { symbol } });
    if (error) throw error;
    return data;
  },

  fetchKeyStatistics: async (symbol: string) => {
    const { data, error } = await supabase.functions.invoke('fetch-key-statistics', { body: { symbol } });
    if (error) throw error;
    return data;
  },
};
