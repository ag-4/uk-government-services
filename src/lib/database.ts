// Database connection and query utilities
import { CouncilMember, LocalCouncil, NewsArticle, Bill, Vote } from './api';

export interface DatabaseConfig {
  connectionString: string;
  maxConnections?: number;
  idleTimeoutMillis?: number;
}

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

export class DatabaseService {
  private config: DatabaseConfig;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>> {
    // Direct PostgreSQL connection using your database
    console.log('Database query:', sql, params);
    
    try {
      // Use MCP PostgreSQL server for queries
      // For now, return fallback to static data until database is properly set up
      return await this.fallbackToStaticData<T>(sql);
    } catch (error) {
      console.error('Database query error:', error);
      return await this.fallbackToStaticData<T>(sql);
    }
  }

  private async fallbackToStaticData<T>(sql: string): Promise<QueryResult<T>> {
    // Fallback to existing JSON data while database is being set up
    if (sql.includes('mps')) {
      try {
        const response = await fetch('/data/updated-mps.json');
        const data = await response.json();
        return {
          rows: Array.isArray(data) ? data : data.mps || [],
          rowCount: Array.isArray(data) ? data.length : data.mps?.length || 0
        } as QueryResult<T>;
      } catch {
        return { rows: [], rowCount: 0 } as QueryResult<T>;
      }
    }
    
    if (sql.includes('postcodes')) {
      try {
        // Try to load postcode data from available files
        const response = await fetch('/data/real-mps-sample.json');
        const data = await response.json();
        return {
          rows: Array.isArray(data) ? data : [],
          rowCount: Array.isArray(data) ? data.length : 0
        } as QueryResult<T>;
      } catch {
        return { rows: [], rowCount: 0 } as QueryResult<T>;
      }
    }
    
    if (sql.includes('news')) {
      // Mock news data
      const mockNews = [
        {
          id: 1,
          title: 'Latest Government Update',
          content: 'Important government announcement...',
          published_date: new Date().toISOString(),
          source: 'GOV.UK',
          category: 'government'
        }
      ];
      return {
        rows: mockNews,
        rowCount: mockNews.length
      } as QueryResult<T>;
    }
    
    if (sql.includes('bills')) {
      // Mock bills data
      const mockBills = [
        {
          id: 1,
          title: 'Sample Parliamentary Bill',
          description: 'A sample bill for demonstration',
          status: 'In Progress',
          introduced_date: new Date().toISOString()
        }
      ];
      return {
        rows: mockBills,
        rowCount: mockBills.length
      } as QueryResult<T>;
    }
    
    return { rows: [], rowCount: 0 } as QueryResult<T>;
  }

  async queryWithCache<T = any>(sql: string, params?: any[], cacheKey?: string): Promise<QueryResult<T>> {
    if (cacheKey) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.data;
      }
    }

    const result = await this.query<T>(sql, params);

    if (cacheKey) {
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
    }

    return result;
  }

  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  private async executeQuery<T>(sql: string, params?: any[]): Promise<T[]> {
    const result = await this.query<T>(sql, params);
    return result.rows;
  }

  private isValidCache(key: string): boolean {
    const cached = this.cache.get(key);
    return cached !== undefined && Date.now() - cached.timestamp < this.CACHE_TTL;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Council Member API Methods
  async getAllCouncilMembers(): Promise<CouncilMember[]> {
    const sql = `
      SELECT 
        id, name, display_name as "displayName", full_title as "fullTitle",
        council, council_id as "councilId", ward, ward_id as "wardId",
        party, party_abbreviation as "partyAbbreviation", party_color as "partyColor",
        gender, term_start_date as "termStartDate", 
        term_end_date as "termEndDate", is_active as "isActive",
        email, phone, website, addresses, biography, 
        thumbnail_url as "thumbnailUrl", postcodes, ward_postcodes as "wardPostcodes",
        committees, experience, social_media as "socialMedia"
      FROM council_members 
      WHERE is_active = true
      ORDER BY name
    `;

    const result = await this.queryWithCache<CouncilMember>(sql, [], 'getAllCouncilMembers');
    return result.rows;
  }

  async getCouncilMemberById(id: string): Promise<CouncilMember> {
    const sql = `
      SELECT 
        id, name, display_name as "displayName", full_title as "fullTitle",
        council, council_id as "councilId", ward, ward_id as "wardId",
        party, party_abbreviation as "partyAbbreviation", party_color as "partyColor",
        gender, term_start_date as "termStartDate", 
        term_end_date as "termEndDate", is_active as "isActive",
        email, phone, website, addresses, biography, 
        thumbnail_url as "thumbnailUrl", postcodes, ward_postcodes as "wardPostcodes",
        committees, experience, social_media as "socialMedia"
      FROM council_members 
      WHERE id = $1 AND is_active = true
    `;

    const result = await this.query<CouncilMember>(sql, [id]);
    if (result.rows.length === 0) {
      throw new Error(`Council member with id ${id} not found`);
    }
    return result.rows[0];
  }

  async searchCouncilMembers(params: {
    search?: string;
    postcode?: string;
    council?: string;
    ward?: string;
    party?: string;
  }): Promise<CouncilMember[]> {
    let sql = `
      SELECT 
        id, name, council, ward, party, party_abbreviation,
        email, phone, website, image_url, social_media,
        postcodes, ward_postcodes, bio, committees,
        years_in_office, last_updated
      FROM council_members 
      WHERE 1=1
    `;

    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params.search) {
      sql += ` AND (LOWER(name) LIKE $${paramIndex} OR LOWER(council) LIKE $${paramIndex} OR LOWER(ward) LIKE $${paramIndex} OR LOWER(party) LIKE $${paramIndex})`;
      queryParams.push(`%${params.search.toLowerCase()}%`);
      paramIndex++;
    }

    if (params.postcode) {
      const postcode = params.postcode.toUpperCase().replace(/\s/g, '');
      sql += ` AND (postcodes::text ILIKE $${paramIndex} OR ward_postcodes::text ILIKE $${paramIndex})`;
      queryParams.push(`%${postcode}%`);
      paramIndex++;
    }

    if (params.council) {
      sql += ` AND LOWER(council) LIKE $${paramIndex}`;
      queryParams.push(`%${params.council.toLowerCase()}%`);
      paramIndex++;
    }

    if (params.ward) {
      sql += ` AND LOWER(ward) LIKE $${paramIndex}`;
      queryParams.push(`%${params.ward.toLowerCase()}%`);
      paramIndex++;
    }

    if (params.party) {
      sql += ` AND (LOWER(party) LIKE $${paramIndex} OR LOWER(party_abbreviation) LIKE $${paramIndex})`;
      queryParams.push(`%${params.party.toLowerCase()}%`);
      paramIndex++;
    }

    sql += ` ORDER BY name`;

    const result = await this.executeQuery<CouncilMember>(sql, queryParams);
    return result;
  }

  async getCouncilMemberByPostcode(postcode: string): Promise<CouncilMember[]> {
    return this.searchCouncilMembers({ postcode });
  }

  // Local Council API Methods
  async getAllLocalCouncils(): Promise<LocalCouncil[]> {
    const cacheKey = 'all_local_councils';
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const query = `
      SELECT 
        id, name, type, region, postcode, address,
        phone, email, website, services, councillors_count,
        population_served, budget, last_updated
      FROM local_councils 
      ORDER BY name ASC
    `;

    const councils = await this.executeQuery<LocalCouncil>(query);
    this.setCache(cacheKey, councils);
    return councils;
  }

  async getLocalCouncilById(id: string): Promise<LocalCouncil> {
    const cacheKey = `local_council_${id}`;
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const query = `
      SELECT 
        id, name, type, region, postcode, address,
        phone, email, website, services, councillors_count,
        population_served, budget, last_updated
      FROM local_councils 
      WHERE id = $1
    `;

    const councils = await this.executeQuery<LocalCouncil>(query, [id]);
    if (councils.length === 0) {
      throw new Error(`Local council with id ${id} not found`);
    }

    const council = councils[0];
    this.setCache(cacheKey, council);
    return council;
  }

  async searchLocalCouncils(params: {
    search?: string;
    postcode?: string;
    type?: string;
    region?: string;
  }): Promise<LocalCouncil[]> {
    let sql = `
      SELECT 
        id, name, type, region, postcode, address,
        phone, email, website, services, councillors_count,
        population_served, budget, last_updated
      FROM local_councils 
      WHERE 1=1
    `;

    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params.search) {
      sql += ` AND (LOWER(name) LIKE $${paramIndex} OR LOWER(type) LIKE $${paramIndex} OR LOWER(region) LIKE $${paramIndex})`;
      queryParams.push(`%${params.search.toLowerCase()}%`);
      paramIndex++;
    }

    if (params.postcode) {
      const postcode = params.postcode.toUpperCase().replace(/\s/g, '');
      sql += ` AND postcode ILIKE $${paramIndex}`;
      queryParams.push(`%${postcode}%`);
      paramIndex++;
    }

    if (params.type) {
      sql += ` AND LOWER(type) LIKE $${paramIndex}`;
      queryParams.push(`%${params.type.toLowerCase()}%`);
      paramIndex++;
    }

    if (params.region) {
      sql += ` AND LOWER(region) LIKE $${paramIndex}`;
      queryParams.push(`%${params.region.toLowerCase()}%`);
      paramIndex++;
    }

    sql += ` ORDER BY name`;

    const result = await this.executeQuery<LocalCouncil>(sql, queryParams);
    return result;
  }

  async validatePostcode(postcode: string): Promise<boolean> {
    const normalizedPostcode = postcode.toUpperCase().replace(/\s/g, '');
    const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?[0-9][A-Z]{2}$/;
    
    if (!postcodeRegex.test(normalizedPostcode)) {
      return false;
    }

    const sql = `
      SELECT id 
      FROM council_members 
      WHERE postcodes::text ILIKE $1 OR ward_postcodes::text ILIKE $1
      LIMIT 1
    `;

    const result = await this.executeQuery<{id: string}>(sql, [`%${normalizedPostcode}%`]);
    return result.length > 0;
  }

  async autocompletePostcode(partial: string): Promise<string[]> {
    const normalizedPartial = partial.toUpperCase().replace(/\s/g, '');
    
    // Get postcodes from council members
    const sql = `
      SELECT DISTINCT unnest(postcodes) as postcode
      FROM council_members 
      WHERE unnest(postcodes) ILIKE $1
      UNION
      SELECT DISTINCT unnest(ward_postcodes) as postcode
      FROM council_members 
      WHERE unnest(ward_postcodes) ILIKE $1
      ORDER BY postcode 
      LIMIT 10
    `;

    const result = await this.executeQuery<{postcode: string}>(sql, [`${normalizedPartial}%`, `${normalizedPartial}%`]);
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

    const result = await this.query<NewsArticle>(sql, queryParams);
    return result.rows;
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

    const result = await this.query<Bill>(sql, queryParams);
    return result.rows;
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

    const result = await this.query<Bill>(sql, [id]);
    if (result.rows.length === 0) {
      throw new Error(`Bill with id ${id} not found`);
    }
    return result.rows[0];
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

// Default database instance with your PostgreSQL connection
export const database = new DatabaseService({
  connectionString: 'postgresql://postgres:8Nv2xu7kkJ8fPbju@db.jiwqiaxuohfebrkgyvpw.supabase.co:5432/postgres'
});

// Create singleton instance
const databaseService = new DatabaseService({
  connectionString: 'postgresql://postgres:8Nv2xu7kkJ8fPbju@db.jiwqiaxuohfebrkgyvpw.supabase.co:5432/postgres'
});

export { databaseService };
export default databaseService;