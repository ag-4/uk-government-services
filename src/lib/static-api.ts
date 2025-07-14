// Static API Service for Production Deployment
// This service loads data from static JSON files instead of backend API calls

import { MP, NewsArticle, Bill, Vote } from './api';

class StaticApiService {
  private cache: Map<string, any> = new Map();
  private baseURL: string = '/data';

  private async loadJsonFile<T>(filename: string): Promise<T> {
    if (this.cache.has(filename)) {
      return this.cache.get(filename);
    }

    try {
      const response = await fetch(`${this.baseURL}/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}: ${response.status}`);
      }
      const data = await response.json();
      this.cache.set(filename, data);
      return data;
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      throw error;
    }
  }

  // MP API Methods
  async getAllMPs(): Promise<MP[]> {
    return this.loadJsonFile<MP[]>('mps.json');
  }

  async getMPById(id: string): Promise<MP> {
    const mps = await this.getAllMPs();
    const mp = mps.find(mp => mp.id === id || mp.parliamentId.toString() === id);
    if (!mp) {
      throw new Error(`MP with id ${id} not found`);
    }
    return mp;
  }

  async searchMPs(params: {
    search?: string;
    postcode?: string;
    constituency?: string;
    party?: string;
  }): Promise<MP[]> {
    const mps = await this.getAllMPs();
    let filteredMPs = mps;

    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredMPs = filteredMPs.filter(mp => 
        mp.name.toLowerCase().includes(searchTerm) ||
        mp.constituency.toLowerCase().includes(searchTerm) ||
        mp.party.toLowerCase().includes(searchTerm)
      );
    }

    if (params.postcode) {
      const postcode = params.postcode.toUpperCase().replace(/\s/g, '');
      filteredMPs = filteredMPs.filter(mp => 
        mp.postcodes?.some(pc => pc.toUpperCase().replace(/\s/g, '').includes(postcode)) ||
        mp.constituencyPostcodes?.some(pc => pc.toUpperCase().replace(/\s/g, '').includes(postcode))
      );
    }

    if (params.constituency) {
      const constituency = params.constituency.toLowerCase();
      filteredMPs = filteredMPs.filter(mp => 
        mp.constituency.toLowerCase().includes(constituency)
      );
    }

    if (params.party) {
      const party = params.party.toLowerCase();
      filteredMPs = filteredMPs.filter(mp => 
        mp.party.toLowerCase().includes(party) ||
        mp.partyAbbreviation.toLowerCase().includes(party)
      );
    }

    return filteredMPs;
  }

  async getMPByPostcode(postcode: string): Promise<MP[]> {
    return this.searchMPs({ postcode });
  }

  async validatePostcode(postcode: string): Promise<{valid: boolean; constituency?: string}> {
    try {
      const postcodeMapping = await this.loadJsonFile<Record<string, string>>('postcode-to-constituency.json');
      const normalizedPostcode = postcode.toUpperCase().replace(/\s/g, '');
      
      // Check if exact postcode exists
      if (postcodeMapping[normalizedPostcode]) {
        return {
          valid: true,
          constituency: postcodeMapping[normalizedPostcode]
        };
      }

      // Check partial matches (first part of postcode)
      const postcodePrefix = normalizedPostcode.substring(0, Math.min(4, normalizedPostcode.length));
      const matchingConstituency = Object.entries(postcodeMapping)
        .find(([pc]) => pc.startsWith(postcodePrefix))?.[1];

      if (matchingConstituency) {
        return {
          valid: true,
          constituency: matchingConstituency
        };
      }

      return { valid: false };
    } catch (error) {
      console.error('Error validating postcode:', error);
      return { valid: false };
    }
  }

  async autocompletePostcode(partial: string): Promise<string[]> {
    try {
      const postcodeMapping = await this.loadJsonFile<Record<string, string>>('postcode-to-constituency.json');
      const normalizedPartial = partial.toUpperCase().replace(/\s/g, '');
      
      const matches = Object.keys(postcodeMapping)
        .filter(postcode => postcode.startsWith(normalizedPartial))
        .slice(0, 10); // Limit to 10 suggestions

      return matches;
    } catch (error) {
      console.error('Error autocompleting postcode:', error);
      return [];
    }
  }

  // News API Methods
  async getLatestNews(params?: {
    category?: string;
    source?: string;
    limit?: number;
    search?: string;
  }): Promise<NewsArticle[]> {
    const news = await this.loadJsonFile<NewsArticle[]>('news.json');
    let filteredNews = news;

    if (params?.category) {
      filteredNews = filteredNews.filter(article => 
        article.category.toLowerCase() === params.category!.toLowerCase()
      );
    }

    if (params?.source) {
      filteredNews = filteredNews.filter(article => 
        article.source.toLowerCase().includes(params.source!.toLowerCase())
      );
    }

    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filteredNews = filteredNews.filter(article => 
        article.title.toLowerCase().includes(searchTerm) ||
        article.summary.toLowerCase().includes(searchTerm)
      );
    }

    if (params?.limit) {
      filteredNews = filteredNews.slice(0, params.limit);
    }

    return filteredNews;
  }

  // Bills API Methods
  async getCurrentBills(params?: {
    limit?: number;
    status?: string;
    house?: string;
  }): Promise<Bill[]> {
    const bills = await this.loadJsonFile<Bill[]>('bills.json');
    let filteredBills = bills;

    if (params?.status) {
      filteredBills = filteredBills.filter(bill => 
        bill.status.toLowerCase().includes(params.status!.toLowerCase())
      );
    }

    if (params?.house) {
      filteredBills = filteredBills.filter(bill => 
        bill.currentHouse.toLowerCase().includes(params.house!.toLowerCase())
      );
    }

    if (params?.limit) {
      filteredBills = filteredBills.slice(0, params.limit);
    }

    return filteredBills;
  }

  async getBillById(id: string): Promise<Bill> {
    const bills = await this.getCurrentBills();
    const bill = bills.find(bill => bill.id === id || bill.billId === id);
    if (!bill) {
      throw new Error(`Bill with id ${id} not found`);
    }
    return bill;
  }

  // Votes API Methods
  async getVotes(params?: {
    limit?: number;
    house?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
  }): Promise<Vote[]> {
    const votes = await this.loadJsonFile<Vote[]>('voting-info.json');
    let filteredVotes = votes;

    if (params?.house) {
      filteredVotes = filteredVotes.filter(vote => 
        vote.house.toLowerCase().includes(params.house!.toLowerCase())
      );
    }

    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filteredVotes = filteredVotes.filter(vote => 
        vote.question.toLowerCase().includes(searchTerm) ||
        (vote.description && vote.description.toLowerCase().includes(searchTerm))
      );
    }

    if (params?.date_from) {
      const fromDate = new Date(params.date_from);
      filteredVotes = filteredVotes.filter(vote => 
        new Date(vote.date) >= fromDate
      );
    }

    if (params?.date_to) {
      const toDate = new Date(params.date_to);
      filteredVotes = filteredVotes.filter(vote => 
        new Date(vote.date) <= toDate
      );
    }

    if (params?.limit) {
      filteredVotes = filteredVotes.slice(0, params.limit);
    }

    return filteredVotes;
  }

  async getVoteById(id: string): Promise<Vote> {
    const votes = await this.getVotes();
    const vote = votes.find(vote => vote.id === id);
    if (!vote) {
      throw new Error(`Vote with id ${id} not found`);
    }
    return vote;
  }

  async getVoteStats(): Promise<any> {
    const votes = await this.getVotes();
    const totalVotes = votes.length;
    const passedVotes = votes.filter(vote => vote.result.toLowerCase().includes('passed')).length;
    const rejectedVotes = votes.filter(vote => vote.result.toLowerCase().includes('rejected')).length;
    
    return {
      total: totalVotes,
      passed: passedVotes,
      rejected: rejectedVotes,
      passRate: totalVotes > 0 ? (passedVotes / totalVotes) * 100 : 0
    };
  }

  // Health Check
  async healthCheck(): Promise<any> {
    try {
      await this.loadJsonFile('system-health-report.json');
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        dataSource: 'static-files'
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Additional utility methods
  async getMessageTemplates(): Promise<any> {
    return this.loadJsonFile('message-templates.json');
  }

  async getCitizenRights(): Promise<any> {
    return this.loadJsonFile('citizen-rights.json');
  }

  async getMPStatistics(): Promise<any> {
    return this.loadJsonFile('mp-statistics.json');
  }

  async getAppSummary(): Promise<any> {
    return this.loadJsonFile('app-summary.json');
  }
}

// Create singleton instance
export const staticApiService = new StaticApiService();
export default staticApiService;