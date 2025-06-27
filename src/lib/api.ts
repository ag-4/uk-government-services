import React from 'react';

// API Configuration
const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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
      const response = await fetch('/data/mps.json');
      const rawMPs = await response.json();
      
      // Transform the data to ensure compatibility
      return rawMPs.map((mp: any) => ({
        ...mp,
        // Ensure legacy fields are available for compatibility
        postcode: mp.postcodes?.[0] || mp.postcode || '',
        fullPostcodes: mp.postcodes || mp.fullPostcodes || [],
        address: mp.addresses?.[0]?.fullAddress || mp.address || 'Parliament House, Westminster, London',
        image: mp.thumbnailUrl || mp.image || '/images/mp-placeholder.jpg',
        // Ensure all required fields have defaults
        committees: mp.committees || [],
        experience: mp.experience || [],
        socialMedia: mp.socialMedia || {},
        addresses: mp.addresses || [],
        constituencyPostcodes: mp.constituencyPostcodes || [],
        membershipEndDate: mp.membershipEndDate || null,
        partyColor: mp.partyColor?.startsWith('#') ? mp.partyColor : `#${mp.partyColor || '666666'}`,
      }));
    } catch (error) {
      console.error('Failed to load fallback MP data:', error);
      return [];
    }
  },

  news: async (): Promise<NewsArticle[]> => {
    try {
      const response = await fetch('/data/news.json');
      return await response.json();
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
