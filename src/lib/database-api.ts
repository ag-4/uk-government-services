// Database API Service - Replaces static JSON files with PostgreSQL database
// This service connects to PostgreSQL to reduce project size and improve performance

import { MP, NewsArticle, Bill, Vote } from './api';
import { DatabaseService } from './database';

class DatabaseApiService {
  private db: DatabaseService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.db = new DatabaseService();
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache(key: string): any {
    const cached = this.cache.get(key);
    return cached ? cached.data : null;
  }

  // MP API Methods
  async getAllMPs(): Promise<MP[]> {
    const cacheKey = 'all_mps';
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const mps = await this.db.getAllMPs();
      this.setCache(cacheKey, mps);
      return mps;
    } catch (error) {
      console.error('Error fetching MPs from database:', error);
      // Fallback to empty array or throw error
      throw new Error('Failed to load MPs data');
    }
  }

  async getMPById(id: string): Promise<MP> {
    const cacheKey = `mp_${id}`;
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const mp = await this.db.getMPById(id);
      if (!mp) {
        throw new Error(`MP with id ${id} not found`);
      }
      this.setCache(cacheKey, mp);
      return mp;
    } catch (error) {
      console.error(`Error fetching MP ${id}:`, error);
      throw error;
    }
  }

  async searchMPs(params: {
    search?: string;
    postcode?: string;
    constituency?: string;
    party?: string;
  }): Promise<MP[]> {
    const cacheKey = `search_mps_${JSON.stringify(params)}`;
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const mps = await this.db.searchMPs(params);
      this.setCache(cacheKey, mps);
      return mps;
    } catch (error) {
      console.error('Error searching MPs:', error);
      throw new Error('Failed to search MPs');
    }
  }

  async getMPByPostcode(postcode: string): Promise<MP[]> {
    return this.searchMPs({ postcode });
  }

  async validatePostcode(postcode: string): Promise<{valid: boolean; constituency?: string}> {
    const cacheKey = `validate_postcode_${postcode}`;
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const result = await this.db.validatePostcode(postcode);
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error validating postcode:', error);
      return { valid: false };
    }
  }

  async autocompletePostcode(partial: string): Promise<string[]> {
    const cacheKey = `autocomplete_${partial}`;
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const suggestions = await this.db.autocompletePostcode(partial);
      this.setCache(cacheKey, suggestions);
      return suggestions;
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
    const cacheKey = `news_${JSON.stringify(params || {})}`;
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const news = await this.db.getLatestNews(params);
      this.setCache(cacheKey, news);
      return news;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw new Error('Failed to load news data');
    }
  }

  // Bills API Methods
  async getCurrentBills(params?: {
    limit?: number;
    status?: string;
    house?: string;
  }): Promise<Bill[]> {
    const cacheKey = `bills_${JSON.stringify(params || {})}`;
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const bills = await this.db.getCurrentBills(params);
      this.setCache(cacheKey, bills);
      return bills;
    } catch (error) {
      console.error('Error fetching bills:', error);
      throw new Error('Failed to load bills data');
    }
  }

  async getBillById(id: string): Promise<Bill> {
    const cacheKey = `bill_${id}`;
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const bill = await this.db.getBillById(id);
      if (!bill) {
        throw new Error(`Bill with id ${id} not found`);
      }
      this.setCache(cacheKey, bill);
      return bill;
    } catch (error) {
      console.error(`Error fetching bill ${id}:`, error);
      throw error;
    }
  }

  // Voting API Methods
  async getVotes(params?: {
    house?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    search?: string;
  }): Promise<Vote[]> {
    const cacheKey = `votes_${JSON.stringify(params || {})}`;
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      // For now, return empty array as voting data is not in our current dataset
      // This can be implemented when voting data is available
      const votes: Vote[] = [];
      this.setCache(cacheKey, votes);
      return votes;
    } catch (error) {
      console.error('Error fetching votes:', error);
      return [];
    }
  }

  async getVoteById(id: string): Promise<Vote> {
    throw new Error('Vote data not available in current dataset');
  }

  async getVoteStats(): Promise<any> {
    return {
      totalVotes: 0,
      recentVotes: 0,
      housesActive: ['Commons', 'Lords']
    };
  }

  // Configuration and Utility Methods
  async getMessageTemplates(): Promise<any> {
    const cacheKey = 'message_templates';
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const templates = await this.db.getMessageTemplates();
      this.setCache(cacheKey, templates);
      return templates;
    } catch (error) {
      console.error('Error fetching message templates:', error);
      return {};
    }
  }

  async getCitizenRights(): Promise<any> {
    const cacheKey = 'citizen_rights';
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const rights = await this.db.getCitizenRights();
      this.setCache(cacheKey, rights);
      return rights;
    } catch (error) {
      console.error('Error fetching citizen rights:', error);
      return {};
    }
  }

  async getMPStatistics(): Promise<any> {
    const cacheKey = 'mp_statistics';
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const stats = await this.db.getMPStatistics();
      this.setCache(cacheKey, stats);
      return stats;
    } catch (error) {
      console.error('Error fetching MP statistics:', error);
      return {
        totalMPs: 0,
        partiesCount: 0,
        constituenciesCount: 0
      };
    }
  }

  async getAppSummary(): Promise<any> {
    const cacheKey = 'app_summary';
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const summary = await this.db.getAppSummary();
      this.setCache(cacheKey, summary);
      return summary;
    } catch (error) {
      console.error('Error fetching app summary:', error);
      return {
        name: 'UK Government Services',
        description: 'Find your MP, track bills, and stay informed about UK politics',
        version: '2.0.0',
        dataSource: 'PostgreSQL Database'
      };
    }
  }

  async healthCheck(): Promise<{status: string; timestamp: string; database: string}> {
    try {
      const health = await this.db.healthCheck();
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'PostgreSQL - Connected'
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'PostgreSQL - Connection Failed'
      };
    }
  }

  // Cache management
  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const databaseApi = new DatabaseApiService();
export default databaseApi;