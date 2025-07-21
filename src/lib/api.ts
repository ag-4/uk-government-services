import React from 'react';

import { staticApiService } from './static-api';

// API Configuration
const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || '/api';

// Detect if we're in production/static deployment
const isStaticDeployment = () => {
  // Check if we're in production and no backend server is available
  return (import.meta as any).env.PROD && !((import.meta as any).env.VITE_API_BASE_URL);
};

// Types
export interface CouncilMember {
  id: string;
  name: string;
  displayName: string;
  fullTitle: string;
  council: string;
  councilId: number;
  ward: string;
  wardId: number;
  party: string;
  partyAbbreviation: string;
  partyColor: string;
  gender: string;
  termStartDate: string;
  termEndDate?: string;
  isActive: boolean;
  email: string;
  phone: string;
  website: string;
  addresses: {
    council?: string;
    ward?: string;
  };
  biography: string;
  thumbnailUrl: string;
  postcodes?: string[];
  wardPostcodes?: string[];
  committees?: string[];
  experience?: string[];
  socialMedia?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface LocalCouncil {
  id: string;
  name: string;
  type: string; // County, District, Borough, City, etc.
  website: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  region: string;
  population: number;
  councilMembers: number;
  services: string[];
  meetingSchedule: string;
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

  // Council Member API Methods
  async getAllCouncilMembers(): Promise<CouncilMember[]> {
    if (isStaticDeployment()) {
      return staticApiService.getAllCouncilMembers();
    }
    return this.fetchWithErrorHandling<CouncilMember[]>('/council-members');
  }

  async getCouncilMemberById(id: string): Promise<CouncilMember> {
    if (isStaticDeployment()) {
      return staticApiService.getCouncilMemberById(id);
    }
    return this.fetchWithErrorHandling<CouncilMember>(`/council-members/${id}`);
  }

  async searchCouncilMembers(params: {
    search?: string;
    postcode?: string;
    council?: string;
    ward?: string;
    party?: string;
  }): Promise<CouncilMember[]> {
    if (isStaticDeployment()) {
      return staticApiService.searchCouncilMembers(params);
    }
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });

    return this.fetchWithErrorHandling<CouncilMember[]>(`/council-members?${searchParams.toString()}`);
  }

  async getCouncilMemberByPostcode(postcode: string): Promise<CouncilMember[]> {
    if (isStaticDeployment()) {
      return staticApiService.getCouncilMemberByPostcode(postcode);
    }
    return this.fetchWithErrorHandling<CouncilMember[]>(`/council-members?postcode=${encodeURIComponent(postcode)}`);
  }

  // Local Council API Methods
  async getAllLocalCouncils(): Promise<LocalCouncil[]> {
    if (isStaticDeployment()) {
      return staticApiService.getAllLocalCouncils();
    }
    return this.fetchWithErrorHandling<LocalCouncil[]>('/local-councils');
  }

  async getLocalCouncilById(id: string): Promise<LocalCouncil> {
    if (isStaticDeployment()) {
      return staticApiService.getLocalCouncilById(id);
    }
    return this.fetchWithErrorHandling<LocalCouncil>(`/local-councils/${id}`);
  }

  async searchLocalCouncils(params: {
    search?: string;
    postcode?: string;
    type?: string;
    region?: string;
  }): Promise<LocalCouncil[]> {
    if (isStaticDeployment()) {
      return staticApiService.searchLocalCouncils(params);
    }
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });

    return this.fetchWithErrorHandling<LocalCouncil[]>(`/local-councils?${searchParams.toString()}`);
  }

  async validatePostcode(postcode: string): Promise<{valid: boolean; council?: string; ward?: string}> {
    if (isStaticDeployment()) {
      return staticApiService.validatePostcode(postcode);
    }
    return this.fetchWithErrorHandling<{valid: boolean; council?: string; ward?: string}>(`/council-members/validate-postcode/${encodeURIComponent(postcode)}`);
  }

  async autocompletePostcode(partial: string): Promise<string[]> {
    if (isStaticDeployment()) {
      return staticApiService.autocompletePostcode(partial);
    }
    return this.fetchWithErrorHandling<string[]>(`/council-members/autocomplete-postcode/${encodeURIComponent(partial)}`);
  }

  // News API Methods
  async getLatestNews(params?: {
    category?: string;
    source?: string;
    limit?: number;
    search?: string;
  }): Promise<NewsArticle[]> {
    if (isStaticDeployment()) {
      return staticApiService.getLatestNews(params);
    }
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
    if (isStaticDeployment()) {
      return staticApiService.getCurrentBills(params);
    }
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
    if (isStaticDeployment()) {
      return staticApiService.getBillById(id);
    }
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
    if (isStaticDeployment()) {
      return staticApiService.getVotes(params);
    }
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
    if (isStaticDeployment()) {
      return staticApiService.getVoteById(id);
    }
    return this.fetchWithErrorHandling<Vote>(`/votes/${id}`);
  }

  async getVoteStats(): Promise<any> {
    if (isStaticDeployment()) {
      return staticApiService.getVoteStats();
    }
    return this.fetchWithErrorHandling<any>('/votes/stats/summary');
  }

  // Health Check
  async healthCheck(): Promise<any> {
    if (isStaticDeployment()) {
      return staticApiService.healthCheck();
    }
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
  councilMembers: async (): Promise<CouncilMember[]> => {
    // Return basic fallback council member data
    return [
      {
        id: 'fallback_cm_1',
        name: 'Sarah Johnson',
        displayName: 'Cllr Sarah Johnson',
        fullTitle: 'Councillor Sarah Johnson',
        council: 'Westminster City Council',
        councilId: 1001,
        ward: 'Marylebone High Street',
        wardId: 2001,
        party: 'Conservative',
        partyAbbreviation: 'Con',
        partyColor: '#0087dc',
        gender: 'F',
        termStartDate: '2022-05-05',
        termEndDate: '2026-05-05',
        isActive: true,
        email: 'sarah.johnson@westminster.gov.uk',
        phone: '020 7641 6000',
        website: 'https://www.westminster.gov.uk/councillors/sarah-johnson',
        thumbnailUrl: '/images/councillor-placeholder.jpg',
        postcodes: ['W1U 2QD', 'W1U 3QA'],
        wardPostcodes: ['W1U 2QD', 'W1U 3QA', 'W1G 0PW'],
        biography: 'Sarah Johnson has been a Conservative councillor for Marylebone High Street ward since 2022.',
        addresses: {
          council: 'Westminster City Hall, 64 Victoria Street, London SW1E 6QP',
          ward: 'Marylebone High Street Ward Office'
        },
        committees: ['Planning Committee', 'Licensing Committee'],
        experience: ['Local Business Owner', 'Community Volunteer'],
        socialMedia: {
          twitter: '@cllrsarahjohnson',
          facebook: 'CllrSarahJohnson'
        }
      },
      {
        id: 'fallback_cm_2',
        name: 'David Williams',
        displayName: 'Cllr David Williams',
        fullTitle: 'Councillor David Williams',
        council: 'Camden Council',
        councilId: 1002,
        ward: 'Bloomsbury',
        wardId: 2002,
        party: 'Labour',
        partyAbbreviation: 'Lab',
        partyColor: '#e4003b',
        gender: 'M',
        termStartDate: '2022-05-05',
        termEndDate: '2026-05-05',
        isActive: true,
        email: 'david.williams@camden.gov.uk',
        phone: '020 7974 4444',
        website: 'https://www.camden.gov.uk/councillors/david-williams',
        thumbnailUrl: '/images/councillor-placeholder.jpg',
        postcodes: ['WC1N 1NY', 'WC1N 2PL'],
        wardPostcodes: ['WC1N 1NY', 'WC1N 2PL', 'WC1E 6BT'],
        biography: 'David Williams has been a Labour councillor for Bloomsbury ward since 2022.',
        addresses: {
          council: 'Camden Town Hall, Judd Street, London WC1H 9JE',
          ward: 'Bloomsbury Ward Office'
        },
        committees: ['Housing Committee', 'Environment Committee'],
        experience: ['Housing Advocate', 'Environmental Campaigner'],
        socialMedia: {
          twitter: '@cllrdavidwilliams'
        }
      }
    ];
  },

  localCouncils: async (): Promise<LocalCouncil[]> => {
    return [
      {
        id: 'fallback_lc_1',
        name: 'Westminster City Council',
        type: 'London Borough',
        website: 'https://www.westminster.gov.uk',
        email: 'info@westminster.gov.uk',
        phone: '020 7641 6000',
        address: 'Westminster City Hall, 64 Victoria Street, London',
        postcode: 'SW1E 6QP',
        region: 'London',
        population: 261000,
        councilMembers: 54,
        services: ['Housing', 'Planning', 'Licensing', 'Environmental Health', 'Council Tax'],
        meetingSchedule: 'Full Council meets monthly, committees meet fortnightly'
      },
      {
        id: 'fallback_lc_2',
        name: 'Camden Council',
        type: 'London Borough',
        website: 'https://www.camden.gov.uk',
        email: 'contact@camden.gov.uk',
        phone: '020 7974 4444',
        address: 'Camden Town Hall, Judd Street, London',
        postcode: 'WC1H 9JE',
        region: 'London',
        population: 270000,
        councilMembers: 54,
        services: ['Housing', 'Education', 'Social Services', 'Planning', 'Waste Management'],
        meetingSchedule: 'Full Council meets monthly, committees meet weekly'
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
