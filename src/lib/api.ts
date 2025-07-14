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
  author?: string;
  department?: string;
  tags?: string[];
  imageUrl?: string;
}

export interface Bill {
  id: string;
  billId: string;
  title: string;
  longTitle?: string;
  summary: string;
  description?: string;
  status: string;
  stage: string;
  currentHouse: string;
  introducedDate: string;
  lastUpdated: string;
  sponsor: string;
  promoter?: string;
  type: string;
  category?: string;
  url: string;
  parliamentUrl?: string;
  sessions?: any[];
  publications?: any[];
  stages?: any[];
}

export interface Vote {
  id: string;
  date: string;
  question: string;
  result: string;
  ayes: number;
  noes: number;
  abstentions: number;
  majority: number;
  turnout: number;
  house: string;
  number: string;
  debate_gid: string;
  url: string;
  description?: string;
  category?: string;
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
    search?: string;
    postcode?: string;
    constituency?: string;
    party?: string;
  }): Promise<MP[]> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });

    return this.fetchWithErrorHandling<MP[]>(`/mps?${searchParams.toString()}`);
  }

  async getMPByPostcode(postcode: string): Promise<MP[]> {
    return this.fetchWithErrorHandling<MP[]>(`/mps?postcode=${encodeURIComponent(postcode)}`);
  }

  async validatePostcode(postcode: string): Promise<{valid: boolean; constituency?: string}> {
    return this.fetchWithErrorHandling<{valid: boolean; constituency?: string}>(`/mps/validate-postcode/${encodeURIComponent(postcode)}`);
  }

  async autocompletePostcode(partial: string): Promise<string[]> {
    return this.fetchWithErrorHandling<string[]>(`/mps/autocomplete-postcode/${encodeURIComponent(partial)}`);
  }

  // News API Methods
  async getLatestNews(params?: {
    category?: string;
    source?: string;
    limit?: number;
    search?: string;
  }): Promise<NewsArticle[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString());
      });
    }
    
    const url = searchParams.toString() ? `/news?${searchParams.toString()}` : '/news';
    return this.fetchWithErrorHandling<NewsArticle[]>(url);
  }

  // Bills API Methods
  async getCurrentBills(params?: {
    limit?: number;
    status?: string;
    house?: string;
  }): Promise<Bill[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString());
      });
    }
    
    const url = searchParams.toString() ? `/bills?${searchParams.toString()}` : '/bills';
    return this.fetchWithErrorHandling<Bill[]>(url);
  }

  async getBillById(id: string): Promise<Bill> {
    return this.fetchWithErrorHandling<Bill>(`/bills/${id}`);
  }

  // Votes API Methods
  async getVotes(params?: {
    limit?: number;
    house?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
  }): Promise<Vote[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString());
      });
    }
    
    const url = searchParams.toString() ? `/votes?${searchParams.toString()}` : '/votes';
    return this.fetchWithErrorHandling<Vote[]>(url);
  }

  async getVoteById(id: string): Promise<Vote> {
    return this.fetchWithErrorHandling<Vote>(`/votes/${id}`);
  }

  async getVoteStats(): Promise<any> {
    return this.fetchWithErrorHandling<any>('/votes/stats/summary');
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
    // Return basic fallback MP data
    return [
      {
        id: 'fallback_1',
        parliamentId: 1001,
        name: 'John Smith',
        displayName: 'John Smith',
        fullTitle: 'John Smith MP',
        constituency: 'Westminster North',
        constituencyId: 1001,
        party: 'Conservative',
        partyAbbreviation: 'Con',
        partyColor: '#0087dc',
        gender: 'M',
        membershipStartDate: '2019-12-12',
        membershipEndDate: null,
        isActive: true,
        email: 'john.smith.mp@parliament.uk',
        phone: '020 7219 3000',
        website: 'https://www.johnsmithmp.co.uk',
        thumbnailUrl: '/images/mp-placeholder.jpg',
        postcodes: ['W1A 0AA'],
        constituencyPostcodes: ['W1A 0AA', 'W1A 1AA'],
        biography: 'John Smith has been the Conservative MP for Westminster North since 2019.',
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
        committees: ['Treasury Select Committee'],
        experience: [],
        socialMedia: {
          twitter: '@johnsmithmp'
        }
      }
    ];
  },

  news: async (): Promise<NewsArticle[]> => {
    return [
      {
        id: 'fallback_news_1',
        title: 'Parliamentary Session Update',
        summary: 'Latest updates from the current parliamentary session.',
        content: 'Parliament continues to debate important legislation affecting citizens across the UK.',
        category: 'Parliament',
        publishedAt: new Date().toISOString(),
        source: 'Parliament.UK',
        url: 'https://www.parliament.uk',
        author: 'Parliamentary Communications',
        tags: ['parliament', 'legislation']
      }
    ];
  },

  bills: async (): Promise<Bill[]> => {
    return [
      {
        id: 'fallback_bill_1',
        billId: 'FB001',
        title: 'Sample Parliamentary Bill',
        summary: 'A sample bill for demonstration purposes.',
        status: 'Under Discussion',
        stage: 'Committee Stage',
        currentHouse: 'Commons',
        introducedDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        sponsor: 'Government',
        type: 'Public Bill',
        url: 'https://www.parliament.uk'
      }
    ];
  },

  votes: async (): Promise<Vote[]> => {
    return [
      {
        id: 'fallback_vote_1',
        date: new Date().toISOString(),
        question: 'Sample Parliamentary Division',
        result: 'Passed',
        ayes: 320,
        noes: 280,
        abstentions: 50,
        majority: 40,
        turnout: 85.5,
        house: 'commons',
        number: '1',
        debate_gid: 'sample_gid',
        url: 'https://www.theyworkforyou.com',
        description: 'A sample parliamentary division for demonstration.'
      }
    ];
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
