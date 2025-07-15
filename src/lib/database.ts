// Database service for PostgreSQL integration
import { MP, NewsArticle, Bill, Vote } from './api';

interface DatabaseConfig {
  connectionString: string;
}

class DatabaseService {
  private config: DatabaseConfig;
  private cache: Map<string, any> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  private async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    try {
      // Use the MCP PostgreSQL server for queries
      const response = await fetch('/api/database/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql, params }),
      });

      if (!response.ok) {
        throw new Error(`Database query failed: ${response.status}`);
      }

      const result = await response.json();
      return result.rows || [];
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  private getCacheKey(method: string, params?: any): string {
    return `${method}_${JSON.stringify(params || {})}`;
  }

  private isValidCache(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? Date.now() < expiry : false;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
  }

  // MP API Methods
  async getAllMPs(): Promise<MP[]> {
    const cacheKey = this.getCacheKey('getAllMPs');
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const sql = `
      SELECT 
        id, parliament_id as "parliamentId", name, display_name as "displayName",
        full_title as "fullTitle", constituency, constituency_id as "constituencyId",
        party, party_abbreviation as "partyAbbreviation", party_color as "partyColor",
        gender, membership_start_date as "membershipStartDate", 
        membership_end_date as "membershipEndDate", is_active as "isActive",
        email, phone, website, addresses, biography, 
        thumbnail_url as "thumbnailUrl", postcodes, constituency_postcodes as "constituencyPostcodes",
        committees, experience, social_media as "socialMedia"
      FROM mps 
      WHERE is_active = true
      ORDER BY name
    `;

    const mps = await this.query<MP>(sql);
    this.setCache(cacheKey, mps);
    return mps;
  }

  async getMPById(id: string): Promise<MP> {
    const sql = `
      SELECT 
        id, parliament_id as "parliamentId", name, display_name as "displayName",
        full_title as "fullTitle", constituency, constituency_id as "constituencyId",
        party, party_abbreviation as "partyAbbreviation", party_color as "partyColor",
        gender, membership_start_date as "membershipStartDate", 
        membership_end_date as "membershipEndDate", is_active as "isActive",
        email, phone, website, addresses, biography, 
        thumbnail_url as "thumbnailUrl", postcodes, constituency_postcodes as "constituencyPostcodes",
        committees, experience, social_media as "socialMedia"
      FROM mps 
      WHERE (id = $1 OR parliament_id::text = $1) AND is_active = true
    `;

    const mps = await this.query<MP>(sql, [id]);
    if (mps.length === 0) {
      throw new Error(`MP with id ${id} not found`);
    }
    return mps[0];
  }

  async searchMPs(params: {
    search?: string;
    postcode?: string;
    constituency?: string;
    party?: string;
  }): Promise<MP[]> {
    let sql = `
      SELECT 
        id, parliament_id as "parliamentId", name, display_name as "displayName",
        full_title as "fullTitle", constituency, constituency_id as "constituencyId",
        party, party_abbreviation as "partyAbbreviation", party_color as "partyColor",
        gender, membership_start_date as "membershipStartDate", 
        membership_end_date as "membershipEndDate", is_active as "isActive",
        email, phone, website, addresses, biography, 
        thumbnail_url as "thumbnailUrl", postcodes, constituency_postcodes as "constituencyPostcodes",
        committees, experience, social_media as "socialMedia"
      FROM mps 
      WHERE is_active = true
    `;

    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params.search) {
      sql += ` AND (LOWER(name) LIKE $${paramIndex} OR LOWER(constituency) LIKE $${paramIndex} OR LOWER(party) LIKE $${paramIndex})`;
      queryParams.push(`%${params.search.toLowerCase()}%`);
      paramIndex++;
    }

    if (params.postcode) {
      const postcode = params.postcode.toUpperCase().replace(/\s/g, '');
      sql += ` AND (postcodes::text ILIKE $${paramIndex} OR constituency_postcodes::text ILIKE $${paramIndex})`;
      queryParams.push(`%${postcode}%`);
      paramIndex++;
    }

    if (params.constituency) {
      sql += ` AND LOWER(constituency) LIKE $${paramIndex}`;
      queryParams.push(`%${params.constituency.toLowerCase()}%`);
      paramIndex++;
    }

    if (params.party) {
      sql += ` AND (LOWER(party) LIKE $${paramIndex} OR LOWER(party_abbreviation) LIKE $${paramIndex})`;
      queryParams.push(`%${params.party.toLowerCase()}%`);
      paramIndex++;
    }

    sql += ` ORDER BY name`;

    return this.query<MP>(sql, queryParams);
  }

  async getMPByPostcode(postcode: string): Promise<MP[]> {
    return this.searchMPs({ postcode });
  }

  async validatePostcode(postcode: string): Promise<{valid: boolean; constituency?: string}> {
    const normalizedPostcode = postcode.toUpperCase().replace(/\s/g, '');
    
    const sql = `
      SELECT constituency 
      FROM postcode_mappings 
      WHERE postcode = $1
    `;

    const result = await this.query<{constituency: string}>(sql, [normalizedPostcode]);
    
    if (result.length > 0) {
      return {
        valid: true,
        constituency: result[0].constituency
      };
    }

    // Check partial matches
    const partialSql = `
      SELECT constituency 
      FROM postcode_mappings 
      WHERE postcode LIKE $1 
      LIMIT 1
    `;

    const partialResult = await this.query<{constituency: string}>(partialSql, [`${normalizedPostcode.substring(0, 4)}%`]);
    
    if (partialResult.length > 0) {
      return {
        valid: true,
        constituency: partialResult[0].constituency
      };
    }

    return { valid: false };
  }

  async autocompletePostcode(partial: string): Promise<string[]> {
    const normalizedPartial = partial.toUpperCase().replace(/\s/g, '');
    
    const sql = `
      SELECT postcode 
      FROM postcode_mappings 
      WHERE postcode LIKE $1 
      ORDER BY postcode 
      LIMIT 10
    `;

    const result = await this.query<{postcode: string}>(sql, [`${normalizedPartial}%`]);
    return result.map(row => row.postcode);
  }

  // News API Methods
  async getLatestNews(params?: {
    category?: string;
    source?: string;
    limit?: number;
    search?: string;
  }): Promise<NewsArticle[]> {
    let sql = `
      SELECT id, title, summary, category, source, timestamp, content, url, image
      FROM news 
      WHERE 1=1
    `;

    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params?.category) {
      sql += ` AND LOWER(category) = $${paramIndex}`;
      queryParams.push(params.category.toLowerCase());
      paramIndex++;
    }

    if (params?.source) {
      sql += ` AND LOWER(source) LIKE $${paramIndex}`;
      queryParams.push(`%${params.source.toLowerCase()}%`);
      paramIndex++;
    }

    if (params?.search) {
      sql += ` AND (LOWER(title) LIKE $${paramIndex} OR LOWER(summary) LIKE $${paramIndex})`;
      queryParams.push(`%${params.search.toLowerCase()}%`);
      paramIndex++;
    }

    sql += ` ORDER BY timestamp DESC`;

    if (params?.limit) {
      sql += ` LIMIT $${paramIndex}`;
      queryParams.push(params.limit);
    }

    return this.query<NewsArticle>(sql, queryParams);
  }

  // Bills API Methods
  async getCurrentBills(params?: {
    limit?: number;
    status?: string;
    house?: string;
  }): Promise<Bill[]> {
    let sql = `
      SELECT 
        id, bill_id as "billId", title, long_title as "longTitle", summary, description,
        status, stage, current_house as "currentHouse", introduced_date as "introducedDate",
        last_updated as "lastUpdated", sponsor, promoter, type, category, url, 
        parliament_url as "parliamentUrl", sessions, publications, stages
      FROM bills 
      WHERE 1=1
    `;

    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params?.status) {
      sql += ` AND LOWER(status) LIKE $${paramIndex}`;
      queryParams.push(`%${params.status.toLowerCase()}%`);
      paramIndex++;
    }

    if (params?.house) {
      sql += ` AND LOWER(current_house) LIKE $${paramIndex}`;
      queryParams.push(`%${params.house.toLowerCase()}%`);
      paramIndex++;
    }

    sql += ` ORDER BY last_updated DESC`;

    if (params?.limit) {
      sql += ` LIMIT $${paramIndex}`;
      queryParams.push(params.limit);
    }

    return this.query<Bill>(sql, queryParams);
  }

  async getBillById(id: string): Promise<Bill> {
    const sql = `
      SELECT 
        id, bill_id as "billId", title, long_title as "longTitle", summary, description,
        status, stage, current_house as "currentHouse", introduced_date as "introducedDate",
        last_updated as "lastUpdated", sponsor, promoter, type, category, url, 
        parliament_url as "parliamentUrl", sessions, publications, stages
      FROM bills 
      WHERE id = $1 OR bill_id::text = $1
    `;

    const bills = await this.query<Bill>(sql, [id]);
    if (bills.length === 0) {
      throw new Error(`Bill with id ${id} not found`);
    }
    return bills[0];
  }

  // Health Check
  async healthCheck(): Promise<any> {
    try {
      await this.query('SELECT 1');
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        dataSource: 'postgresql'
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Create singleton instance
const databaseService = new DatabaseService({
  connectionString: 'postgresql://postgres:8Nv2xu7kkJ8fPbju@db.jiwqiaxuohfebrkgyvpw.supabase.co:5432/postgres'
});

export { databaseService };
export default databaseService;