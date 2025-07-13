import React from 'react';

// API Configuration
const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || '/api';

// Types
export interface MP {
  id: string;
  parliamentId: number;
  name: string;
  displayName: string;
  fullTitle: string;
  constituency: string;
  constituencyId: number;
  party: string;
  partyAbbreviation: string;
  partyColor: string;
  gender: string;
  membershipStartDate: string;
  membershipEndDate: string | null;
  isActive: boolean;
  email: string;
  phone: string;
  website: string;
  addresses: Array<{
    type: string;
    fullAddress: string;
    postcode?: string;
    line1?: string;
    line2?: string;
    town?: string;
    county?: string;
    country?: string;
  }>;
  biography: string;
  thumbnailUrl: string;
  postcodes: string[];
  constituencyPostcodes: string[];
  committees: string[];
  experience: any[];
  socialMedia: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  // Legacy fields for compatibility
  postcode?: string;
  fullPostcodes?: string[];
  address?: string;
  image?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  publishedAt: string;
  source: string;
  url: string;
}

// API Service Class
class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'API request failed');
      }

      return data.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // MP API Methods
  async getAllMPs(): Promise<MP[]> {
    return this.fetchWithErrorHandling<MP[]>('/mps');
  }

  async getMPById(id: string): Promise<MP> {
    return this.fetchWithErrorHandling<MP>(`/mps/${id}`);
  }

  async searchMPs(params: {
    q?: string;
    postcode?: string;
    constituency?: string;
    party?: string;
  }): Promise<MP[]> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });

    return this.fetchWithErrorHandling<MP[]>(`/mps/search?${searchParams.toString()}`);
  }

  // News API Methods
  async getLatestNews(): Promise<NewsArticle[]> {
    return this.fetchWithErrorHandling<NewsArticle[]>('/news');
  }

  // Parliament API Methods
  async getCurrentBills(): Promise<any[]> {
    return this.fetchWithErrorHandling<any[]>('/parliament/bills');
  }

  // Health Check
  async healthCheck(): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Fallback functions for when API is not available
export const fallbackData = {
  mps: async (): Promise<MP[]> => {
    try {
      // Fetch directly from Parliament API as fallback
      const response = await fetch('https://members-api.parliament.uk/api/Members/Search?House=Commons&IsCurrentMember=true&take=650');
      if (response.ok) {
        const data = await response.json();
        return data.items?.map((member: any) => ({
          id: `MP${member.value.id}`,
          parliamentId: member.value.id,
          name: member.value.nameDisplayAs,
          displayName: member.value.nameDisplayAs,
          fullTitle: member.value.nameFullTitle,
          constituency: member.value.latestHouseMembership?.membershipFrom || 'Unknown',
          party: member.value.latestParty?.name || 'Unknown',
          partyAbbreviation: member.value.latestParty?.abbreviation || '',
          partyColor: member.value.latestParty?.name === 'Conservative' ? '#0087dc' :
                     member.value.latestParty?.name === 'Labour' ? '#d50000' :
                     member.value.latestParty?.name === 'Liberal Democrat' ? '#faa61a' :
                     member.value.latestParty?.name === 'Green' ? '#6ab023' :
                     member.value.latestParty?.name?.includes('SNP') ? '#fff95d' : '#666666',
          gender: member.value.gender,
          membershipStartDate: member.value.latestHouseMembership?.membershipStartDate || '',
          membershipEndDate: member.value.latestHouseMembership?.membershipEndDate || null,
          isActive: true,
          email: `${member.value.nameDisplayAs.toLowerCase().replace(/\s+/g, '.')}.mp@parliament.uk`,
          phone: '020 7219 3000',
          website: '',
          image: member.value.thumbnailUrl || '/images/mp-placeholder.jpg',
          thumbnailUrl: member.value.thumbnailUrl || '/images/mp-placeholder.jpg',
          postcodes: ['SW1A'],
          biography: `${member.value.nameDisplayAs} is the ${member.value.latestParty?.name || ''} MP for ${member.value.latestHouseMembership?.membershipFrom || ''}.`,
          addresses: [{
            type: 'Parliamentary',
            fullAddress: 'House of Commons, Westminster, London SW1A 0AA',
            postcode: 'SW1A 0AA',
            line1: 'House of Commons',
            line2: 'Westminster',
            town: 'London',
            county: 'Greater London',
            country: 'UK'
          }],
          committees: [],
          socialMedia: {},
          constituencyPostcodes: []
        })) || [];
      }
      return [];
    } catch (error) {
      console.error('Failed to load fallback MP data:', error);
      return [];
    }
  },

  news: async (): Promise<NewsArticle[]> => {
    try {
      // Fetch live news from BBC RSS feed via rss2json
      const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=http://feeds.bbci.co.uk/news/politics/rss.xml');
      if (response.ok) {
        const data = await response.json();
        return data.items?.map((item: any) => ({
          id: item.guid || item.link,
          title: item.title,
          summary: item.description?.replace(/<[^>]*>/g, '') || '',
          content: item.description?.replace(/<[^>]*>/g, '') || '',
          url: item.link,
          publishedAt: item.pubDate,
          source: 'BBC News',
          category: 'Politics'
        })) || [];
      }
      return [];
    } catch (error) {
      console.error('Failed to load fallback news data:', error);
      return [];
    }
  }
};

// Custom hook for API calls with fallback
export const useApiWithFallback = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchWithFallback = async <T>(
    apiCall: () => Promise<T>,
    fallbackCall: () => Promise<T>
  ): Promise<T> => {
    try {
      if (!isOnline) {
        throw new Error('Offline');
      }
      return await apiCall();
    } catch (error) {
      console.warn('API call failed, using fallback data:', error);
      return await fallbackCall();
    }
  };

  return { fetchWithFallback, isOnline };
};

export default apiService;
