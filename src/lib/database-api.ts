// Database API Service - Connects to PostgreSQL database
// This service connects to PostgreSQL to reduce project size and improve performance

import { CouncilMember, LocalCouncil, NewsArticle, Bill, Vote } from './api';
import { database } from './database';

class DatabaseApiService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private readonly DB_CONFIG = {
      host: 'db.jiwqiaxuohfebrkgyvpw.supabase.co',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'sb_secret_XPWPgj2dnThrz6fWQqPgfA_8nIp0CCq',
      ssl: { rejectUnauthorized: false }
   };

  constructor() {
    // Database connection is handled by the database service
  }

  private async queryDatabase<T>(sql: string, params: any[] = []): Promise<T[]> {
    try {
      const { Client } = await import('pg');
      const client = new Client(this.DB_CONFIG);
      await client.connect();
      const result = await client.query(sql, params);
      await client.end();
      return result.rows;
    } catch (error) {
      console.error('Database query error:', error);
      console.log('Falling back to streamlined local data...');
      
      // Determine data type from SQL query
      if (sql.toLowerCase().includes('council_members')) {
        return this.loadStreamlinedData('council_members');
      } else if (sql.toLowerCase().includes('postcode')) {
        return this.loadStreamlinedData('postcodes');
      }
      
      return [];
    }
  }

  private async loadStreamlinedData(type: string): Promise<any[]> {
    try {
      if (type === 'council_members') {
        const response = await fetch('/council-members.json');
        if (response.ok) {
          return await response.json();
        }
      } else if (type === 'postcodes') {
        const response = await fetch('/postcode-to-mp-lookup.json');
        if (response.ok) {
          const lookup = await response.json();
          return Object.keys(lookup).map(postcode => ({
            postcode,
            ...lookup[postcode]
          }));
        }
      }
    } catch (error) {
      console.warn(`Failed to load ${type} from streamlined files:`, error);
    }
    return [];
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

  private async fallbackToStaticData<T>(type: string): Promise<T[]> {
    try {
      let filename = '';
      switch (type) {
        case 'localCouncils':
          filename = '/local-councils.json';
          break;
        case 'news':
          filename = '/news.json';
          break;
        case 'bills':
          filename = '/bills.json';
          break;
        default:
          return [];
      }
      
      const response = await fetch(filename);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`Failed to load ${type} from static files:`, error);
    }
    return [];
  }

  // Council Member API Methods
  async getAllCouncilMembers(): Promise<CouncilMember[]> {
    const cacheKey = 'all_council_members';
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const councilMembers = await this.queryDatabase<CouncilMember>('SELECT * FROM council_members ORDER BY name');
      this.setCache(cacheKey, councilMembers);
      return councilMembers;
    } catch (error) {
      console.error('Error fetching council members from database:', error);
      // Fallback to empty array or throw error
      throw new Error('Failed to load council members data');
    }
  }

  async getCouncilMemberById(id: string): Promise<CouncilMember> {
    const cacheKey = `council_member_${id}`;
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const members = await this.queryDatabase<CouncilMember>('SELECT * FROM council_members WHERE id = $1', [id]);
      const member = members[0];
      if (!member) {
        throw new Error(`Council member with id ${id} not found`);
      }
      this.setCache(cacheKey, member);
      return member;
    } catch (error) {
      console.error(`Error fetching council member ${id}:`, error);
      throw error;
    }
  }

  async searchCouncilMembers(params: {
    search?: string;
    postcode?: string;
    ward?: string;
    party?: string;
    council?: string;
  }): Promise<CouncilMember[]> {
    const cacheKey = `search_council_members_${JSON.stringify(params)}`;
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      let sql = 'SELECT * FROM council_members WHERE 1=1';
      const sqlParams: any[] = [];
      let paramIndex = 1;

      if (params.search) {
        sql += ` AND (name ILIKE $${paramIndex} OR ward ILIKE $${paramIndex})`;
        sqlParams.push(`%${params.search}%`);
        paramIndex++;
      }

      if (params.postcode) {
        sql += ` AND postcode = $${paramIndex}`;
        sqlParams.push(params.postcode);
        paramIndex++;
      }

      if (params.ward) {
        sql += ` AND ward ILIKE $${paramIndex}`;
        sqlParams.push(`%${params.ward}%`);
        paramIndex++;
      }

      if (params.party) {
        sql += ` AND party ILIKE $${paramIndex}`;
        sqlParams.push(`%${params.party}%`);
        paramIndex++;
      }

      if (params.council) {
        sql += ` AND council ILIKE $${paramIndex}`;
        sqlParams.push(`%${params.council}%`);
        paramIndex++;
      }

      sql += ' ORDER BY name';

      const members = await this.queryDatabase<CouncilMember>(sql, sqlParams);
      this.setCache(cacheKey, members);
      return members;
    } catch (error) {
      console.error('Error searching council members:', error);
      throw new Error('Failed to search council members');
    }
  }

  async getCouncilMembersByPostcode(postcode: string): Promise<CouncilMember[]> {
    return this.searchCouncilMembers({ postcode });
  }

  // Local Council API Methods
  async getAllLocalCouncils(): Promise<LocalCouncil[]> {
    const cacheKey = 'all_local_councils';
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const councils = await this.queryDatabase<LocalCouncil>('SELECT * FROM local_councils ORDER BY name');
      this.setCache(cacheKey, councils);
      return councils;
    } catch (error) {
      console.error('Error fetching all local councils:', error);
      return this.fallbackToStaticData<LocalCouncil>('localCouncils');
    }
  }

  async getLocalCouncilById(id: string): Promise<LocalCouncil> {
    const cacheKey = `local_council_${id}`;
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const councils = await this.queryDatabase<LocalCouncil>('SELECT * FROM local_councils WHERE id = $1', [id]);
      const council = councils[0];
      if (!council) {
        throw new Error(`Local council with id ${id} not found`);
      }
      this.setCache(cacheKey, council);
      return council;
    } catch (error) {
      console.error(`Error fetching local council ${id}:`, error);
      throw error;
    }
  }

  async searchLocalCouncils(params: {
    name?: string;
    type?: string;
    region?: string;
    postcode?: string;
  }): Promise<LocalCouncil[]> {
    const cacheKey = `search_local_councils_${JSON.stringify(params)}`;
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      let sql = 'SELECT * FROM local_councils WHERE 1=1';
      const sqlParams: any[] = [];
      let paramIndex = 1;

      if (params.name) {
        sql += ` AND name ILIKE $${paramIndex}`;
        sqlParams.push(`%${params.name}%`);
        paramIndex++;
      }

      if (params.type) {
        sql += ` AND type = $${paramIndex}`;
        sqlParams.push(params.type);
        paramIndex++;
      }

      if (params.region) {
        sql += ` AND region = $${paramIndex}`;
        sqlParams.push(params.region);
        paramIndex++;
      }

      if (params.postcode) {
        sql += ` AND postcodes @> $${paramIndex}`;
        sqlParams.push(JSON.stringify([params.postcode]));
        paramIndex++;
      }

      sql += ' ORDER BY name LIMIT 50';

      const councils = await this.queryDatabase<LocalCouncil>(sql, sqlParams);
      this.setCache(cacheKey, councils);
      return councils;
    } catch (error) {
      console.error('Error searching local councils:', error);
      return this.fallbackToStaticData<LocalCouncil>('localCouncils');
    }
  }

  async validatePostcode(postcode: string): Promise<{valid: boolean; constituency?: string}> {
    const cacheKey = `validate_postcode_${postcode}`;
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const normalizedPostcode = postcode.toUpperCase().replace(/\s+/g, '');
      const results = await this.queryDatabase<{constituency: string}>(
        'SELECT constituency FROM postcodes WHERE postcode = $1',
        [normalizedPostcode]
      );
      
      const result = results.length > 0 
        ? { valid: true, constituency: results[0].constituency }
        : { valid: false };
      
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
      const normalizedPartial = partial.toUpperCase().replace(/\s+/g, '');
      const results = await this.queryDatabase<{postcode: string}>(
        'SELECT DISTINCT postcode FROM postcodes WHERE postcode LIKE $1 ORDER BY postcode LIMIT 10',
        [`${normalizedPartial}%`]
      );
      
      const suggestions = results.map(row => row.postcode);
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
      let sql = 'SELECT * FROM news WHERE 1=1';
      const sqlParams: any[] = [];
      let paramIndex = 1;

      if (params?.category) {
        sql += ` AND category = $${paramIndex}`;
        sqlParams.push(params.category);
        paramIndex++;
      }

      if (params?.source) {
        sql += ` AND source = $${paramIndex}`;
        sqlParams.push(params.source);
        paramIndex++;
      }

      if (params?.search) {
        sql += ` AND (title ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`;
        sqlParams.push(`%${params.search}%`);
        paramIndex++;
      }

      sql += ' ORDER BY published_date DESC';

      if (params?.limit) {
        sql += ` LIMIT $${paramIndex}`;
        sqlParams.push(params.limit);
      } else {
        sql += ' LIMIT 10';
      }

      const news = await this.queryDatabase<NewsArticle>(sql, sqlParams);
      this.setCache(cacheKey, news);
      return news;
    } catch (error) {
      console.error('Error fetching news:', error);
      return this.fallbackToStaticData<NewsArticle>('news');
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
      let sql = 'SELECT * FROM bills WHERE 1=1';
      const sqlParams: any[] = [];
      let paramIndex = 1;

      if (params?.status) {
        sql += ` AND status = $${paramIndex}`;
        sqlParams.push(params.status);
        paramIndex++;
      }

      if (params?.house) {
        sql += ` AND house = $${paramIndex}`;
        sqlParams.push(params.house);
        paramIndex++;
      }

      sql += ' ORDER BY introduced_date DESC';

      if (params?.limit) {
        sql += ` LIMIT $${paramIndex}`;
        sqlParams.push(params.limit);
      } else {
        sql += ' LIMIT 10';
      }

      const bills = await this.queryDatabase<Bill>(sql, sqlParams);
      this.setCache(cacheKey, bills);
      return bills;
    } catch (error) {
      console.error('Error fetching bills:', error);
      return this.fallbackToStaticData<Bill>('bills');
    }
  }

  async getBillById(id: string): Promise<Bill> {
    const cacheKey = `bill_${id}`;
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const bills = await this.queryDatabase<Bill>('SELECT * FROM bills WHERE id = $1', [id]);
      const bill = bills[0];
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
      const templates = await this.queryDatabase<any>('SELECT * FROM message_templates');
      const templatesObj = templates.reduce((acc, template) => {
        acc[template.name] = template.content;
        return acc;
      }, {});
      this.setCache(cacheKey, templatesObj);
      return templatesObj;
    } catch (error) {
      console.error('Error fetching message templates:', error);
      return {
        default: 'Dear {council_member_name}, I am writing to you as my local council member regarding...',
        climate: 'Dear {council_member_name}, I am concerned about climate change and would like to know your position on...',
        healthcare: 'Dear {council_member_name}, As your constituent, I would like to discuss healthcare issues affecting our area...'
      };
    }
  }

  async getCitizenRights(): Promise<any> {
    const cacheKey = 'citizen_rights';
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const rights = await this.queryDatabase<any>('SELECT * FROM citizen_rights');
      const rightsObj = rights.reduce((acc, right) => {
        acc[right.category] = right.description;
        return acc;
      }, {});
      this.setCache(cacheKey, rightsObj);
      return rightsObj;
    } catch (error) {
      console.error('Error fetching citizen rights:', error);
      return {
        voting: 'You have the right to vote in elections and referendums',
        representation: 'You have the right to contact your council member and expect a response',
        information: 'You have the right to access information about government decisions'
      };
    }
  }

  async getCouncilMemberStatistics(): Promise<any> {
    const cacheKey = 'council_member_statistics';
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const totalMembers = await this.queryDatabase<{count: number}>('SELECT COUNT(*) as count FROM council_members');
      const partiesCount = await this.queryDatabase<{count: number}>('SELECT COUNT(DISTINCT party) as count FROM council_members');
      const wardsCount = await this.queryDatabase<{count: number}>('SELECT COUNT(DISTINCT ward) as count FROM council_members');
      const councilsCount = await this.queryDatabase<{count: number}>('SELECT COUNT(DISTINCT council) as count FROM council_members');
      
      const stats = {
        totalMembers: totalMembers[0]?.count || 0,
        partiesCount: partiesCount[0]?.count || 0,
        wardsCount: wardsCount[0]?.count || 0,
        councilsCount: councilsCount[0]?.count || 0
      };
      
      this.setCache(cacheKey, stats);
      return stats;
    } catch (error) {
      console.error('Error fetching council member statistics:', error);
      return {
        totalMembers: 0,
        partiesCount: 0,
        wardsCount: 0,
        councilsCount: 0
      };
    }
  }

  async getAppSummary(): Promise<any> {
    const cacheKey = 'app_summary';
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const summary = {
        name: 'UK Local Government Services',
        description: 'Find your local council members, track local issues, and stay informed about local politics',
        version: '2.0.0',
        dataSource: 'PostgreSQL Database',
        lastUpdated: new Date().toISOString()
      };
      
      this.setCache(cacheKey, summary);
      return summary;
    } catch (error) {
      console.error('Error fetching app summary:', error);
      return {
        name: 'UK Local Government Services',
        description: 'Find your local council members, track local issues, and stay informed about local politics',
        version: '2.0.0',
        dataSource: 'PostgreSQL Database'
      };
    }
  }

  async healthCheck(): Promise<{status: string; timestamp: string; database: string}> {
    try {
      await this.queryDatabase<any>('SELECT 1');
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