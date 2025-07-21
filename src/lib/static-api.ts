// Static API Service for Production Deployment
// This service loads data from static JSON files instead of backend API calls

import { CouncilMember, LocalCouncil, NewsArticle, Bill, Vote } from './api';

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

  // Council Member API Methods
  async getAllCouncilMembers(): Promise<CouncilMember[]> {
    return this.loadJsonFile<CouncilMember[]>('council-members.json');
  }

  async getCouncilMemberById(id: string): Promise<CouncilMember> {
    const councilMembers = await this.getAllCouncilMembers();
    const member = councilMembers.find(cm => cm.id === id);
    if (!member) {
      throw new Error(`Council member with id ${id} not found`);
    }
    return member;
  }

  async searchCouncilMembers(params: {
    search?: string;
    postcode?: string;
    council?: string;
    ward?: string;
    party?: string;
  }): Promise<CouncilMember[]> {
    const councilMembers = await this.getAllCouncilMembers();
    let filteredMembers = councilMembers;

    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredMembers = filteredMembers.filter(cm => 
        cm.name.toLowerCase().includes(searchTerm) ||
        cm.council.toLowerCase().includes(searchTerm) ||
        cm.ward.toLowerCase().includes(searchTerm) ||
        cm.party.toLowerCase().includes(searchTerm)
      );
    }

    if (params.postcode) {
      const postcode = params.postcode.toUpperCase().replace(/\s/g, '');
      filteredMembers = filteredMembers.filter(cm => 
        cm.postcodes?.some(pc => pc.toUpperCase().replace(/\s/g, '').includes(postcode)) ||
        cm.wardPostcodes?.some(pc => pc.toUpperCase().replace(/\s/g, '').includes(postcode))
      );
    }

    if (params.council) {
      const council = params.council.toLowerCase();
      filteredMembers = filteredMembers.filter(cm => 
        cm.council.toLowerCase().includes(council)
      );
    }

    if (params.ward) {
      const ward = params.ward.toLowerCase();
      filteredMembers = filteredMembers.filter(cm => 
        cm.ward.toLowerCase().includes(ward)
      );
    }

    if (params.party) {
      const party = params.party.toLowerCase();
      filteredMembers = filteredMembers.filter(cm => 
        cm.party.toLowerCase().includes(party) ||
        cm.partyAbbreviation.toLowerCase().includes(party)
      );
    }

    return filteredMembers;
  }

  async getCouncilMemberByPostcode(postcode: string): Promise<CouncilMember[]> {
    return this.searchCouncilMembers({ postcode });
  }

  // Local Council API Methods
  async getAllLocalCouncils(): Promise<LocalCouncil[]> {
    return this.loadJsonFile<LocalCouncil[]>('local-councils.json');
  }

  async getLocalCouncilById(id: string): Promise<LocalCouncil> {
    const councils = await this.getAllLocalCouncils();
    const council = councils.find(c => c.id === id);
    if (!council) {
      throw new Error(`Local council with id ${id} not found`);
    }
    return council;
  }

  async searchLocalCouncils(params: {
    search?: string;
    postcode?: string;
    type?: string;
    region?: string;
  }): Promise<LocalCouncil[]> {
    const councils = await this.getAllLocalCouncils();
    let filteredCouncils = councils;

    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredCouncils = filteredCouncils.filter(c => 
        c.name.toLowerCase().includes(searchTerm) ||
        c.type.toLowerCase().includes(searchTerm) ||
        c.region.toLowerCase().includes(searchTerm)
      );
    }

    if (params.postcode) {
      const postcode = params.postcode.toUpperCase().replace(/\s/g, '');
      filteredCouncils = filteredCouncils.filter(c => 
        c.postcode.toUpperCase().replace(/\s/g, '').includes(postcode)
      );
    }

    if (params.type) {
      const type = params.type.toLowerCase();
      filteredCouncils = filteredCouncils.filter(c => 
        c.type.toLowerCase().includes(type)
      );
    }

    if (params.region) {
      const region = params.region.toLowerCase();
      filteredCouncils = filteredCouncils.filter(c => 
        c.region.toLowerCase().includes(region)
      );
    }

    return filteredCouncils;
  }

  async validatePostcode(postcode: string): Promise<boolean> {
    const normalizedPostcode = postcode.toUpperCase().replace(/\s/g, '');
    const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?[0-9][A-Z]{2}$/;
    
    if (!postcodeRegex.test(normalizedPostcode)) {
      return false;
    }

    try {
      const councilMembers = await this.getAllCouncilMembers();
      return councilMembers.some(cm => 
        cm.postcodes?.some(pc => pc.toUpperCase().replace(/\s/g, '') === normalizedPostcode) ||
        cm.wardPostcodes?.some(pc => pc.toUpperCase().replace(/\s/g, '') === normalizedPostcode)
      );
    } catch (error) {
      console.error('Error validating postcode:', error);
      return false;
    }
  }

  async autocompletePostcode(partial: string): Promise<string[]> {
    try {
      const councilMembers = await this.getAllCouncilMembers();
      const normalizedPartial = partial.toUpperCase().replace(/\s/g, '');
      
      const allPostcodes = new Set<string>();
      councilMembers.forEach(cm => {
        cm.postcodes?.forEach(pc => allPostcodes.add(pc));
        cm.wardPostcodes?.forEach(pc => allPostcodes.add(pc));
      });

      const matches = Array.from(allPostcodes)
        .filter(postcode => postcode.toUpperCase().replace(/\s/g, '').startsWith(normalizedPartial))
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

  async getCouncilStatistics(): Promise<any> {
    return this.loadJsonFile('council-statistics.json');
  }

  async getAppSummary(): Promise<any> {
    return this.loadJsonFile('app-summary.json');
  }
}

// Create singleton instance
export const staticApiService = new StaticApiService();
export default staticApiService;