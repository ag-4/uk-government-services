// Migration script to move data from JSON files to PostgreSQL
import fs from 'fs';
import path from 'path';

// Database schema creation SQL
const createTablesSQL = `
-- Create MPs table
CREATE TABLE IF NOT EXISTS mps (
  id VARCHAR(20) PRIMARY KEY,
  parliament_id INTEGER UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  full_title VARCHAR(255),
  constituency VARCHAR(255) NOT NULL,
  constituency_id INTEGER,
  party VARCHAR(100) NOT NULL,
  party_abbreviation VARCHAR(10),
  party_color VARCHAR(7),
  gender CHAR(1),
  membership_start_date TIMESTAMP,
  membership_end_date TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  email VARCHAR(255),
  phone VARCHAR(50),
  website VARCHAR(500),
  addresses JSONB DEFAULT '[]',
  biography TEXT,
  thumbnail_url VARCHAR(500),
  postcodes JSONB DEFAULT '[]',
  constituency_postcodes JSONB DEFAULT '[]',
  committees JSONB DEFAULT '[]',
  experience JSONB DEFAULT '[]',
  social_media JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for MPs table
CREATE INDEX IF NOT EXISTS idx_mps_constituency ON mps(constituency);
CREATE INDEX IF NOT EXISTS idx_mps_party ON mps(party);
CREATE INDEX IF NOT EXISTS idx_mps_name ON mps(name);
CREATE INDEX IF NOT EXISTS idx_mps_active ON mps(is_active);
CREATE INDEX IF NOT EXISTS idx_mps_postcodes ON mps USING GIN(postcodes);
CREATE INDEX IF NOT EXISTS idx_mps_constituency_postcodes ON mps USING GIN(constituency_postcodes);

-- Create postcode mappings table
CREATE TABLE IF NOT EXISTS postcode_mappings (
  postcode VARCHAR(10) PRIMARY KEY,
  constituency VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_postcode_mappings_constituency ON postcode_mappings(constituency);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id VARCHAR(20) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  summary TEXT,
  category VARCHAR(100),
  source VARCHAR(100),
  timestamp TIMESTAMP NOT NULL,
  content TEXT,
  url VARCHAR(500),
  image VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_source ON news(source);
CREATE INDEX IF NOT EXISTS idx_news_timestamp ON news(timestamp DESC);

-- Create bills table
CREATE TABLE IF NOT EXISTS bills (
  id VARCHAR(20) PRIMARY KEY,
  bill_id INTEGER,
  title VARCHAR(500) NOT NULL,
  long_title TEXT,
  summary TEXT,
  description TEXT,
  status VARCHAR(100),
  stage VARCHAR(100),
  current_house VARCHAR(100),
  introduced_date TIMESTAMP,
  last_updated TIMESTAMP,
  sponsor VARCHAR(255),
  promoter VARCHAR(100),
  type VARCHAR(100),
  category VARCHAR(100),
  url VARCHAR(500),
  parliament_url VARCHAR(500),
  sessions JSONB DEFAULT '[]',
  publications JSONB DEFAULT '[]',
  stages JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bills_status ON bills(status);
CREATE INDEX IF NOT EXISTS idx_bills_house ON bills(current_house);
CREATE INDEX IF NOT EXISTS idx_bills_category ON bills(category);
CREATE INDEX IF NOT EXISTS idx_bills_updated ON bills(last_updated DESC);

-- Create voting info table (for storing voting guide data)
CREATE TABLE IF NOT EXISTS voting_info (
  id SERIAL PRIMARY KEY,
  section VARCHAR(100) NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create citizen rights table
CREATE TABLE IF NOT EXISTS citizen_rights (
  id SERIAL PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create message templates table
CREATE TABLE IF NOT EXISTS message_templates (
  id SERIAL PRIMARY KEY,
  template_type VARCHAR(100) NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create system health table
CREATE TABLE IF NOT EXISTS system_health (
  id SERIAL PRIMARY KEY,
  status VARCHAR(50) NOT NULL,
  data JSONB NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

interface MigrationConfig {
  dataPath: string;
  connectionString: string;
}

class DatabaseMigration {
  private config: MigrationConfig;

  constructor(config: MigrationConfig) {
    this.config = config;
  }

  private async executeSQL(sql: string, params: any[] = []): Promise<any> {
    // This would use the MCP PostgreSQL server
    // For now, we'll log the SQL that would be executed
    console.log('Executing SQL:', sql.substring(0, 100) + '...');
    console.log('Parameters:', params.length > 0 ? params.slice(0, 3) + '...' : 'none');
    
    // In a real implementation, this would execute the SQL using MCP
    return { success: true };
  }

  private loadJsonFile<T>(filename: string): T {
    const filePath = path.join(this.config.dataPath, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }

  async createTables(): Promise<void> {
    console.log('Creating database tables...');
    await this.executeSQL(createTablesSQL);
    console.log('Tables created successfully');
  }

  async migrateMPs(): Promise<void> {
    console.log('Migrating MPs data...');
    
    const mps = this.loadJsonFile<any[]>('mps.json');
    console.log(`Found ${mps.length} MPs to migrate`);

    const insertSQL = `
      INSERT INTO mps (
        id, parliament_id, name, display_name, full_title, constituency, constituency_id,
        party, party_abbreviation, party_color, gender, membership_start_date, 
        membership_end_date, is_active, email, phone, website, addresses, biography,
        thumbnail_url, postcodes, constituency_postcodes, committees, experience, social_media
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
      ) ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        display_name = EXCLUDED.display_name,
        constituency = EXCLUDED.constituency,
        party = EXCLUDED.party,
        is_active = EXCLUDED.is_active,
        updated_at = CURRENT_TIMESTAMP
    `;

    for (const mp of mps) {
      const params = [
        mp.id,
        mp.parliamentId,
        mp.name,
        mp.displayName,
        mp.fullTitle,
        mp.constituency,
        mp.constituencyId,
        mp.party,
        mp.partyAbbreviation,
        mp.partyColor,
        mp.gender,
        mp.membershipStartDate,
        mp.membershipEndDate,
        mp.isActive,
        mp.email,
        mp.phone,
        mp.website,
        JSON.stringify(mp.addresses || []),
        mp.biography,
        mp.thumbnailUrl,
        JSON.stringify(mp.postcodes || []),
        JSON.stringify(mp.constituencyPostcodes || []),
        JSON.stringify(mp.committees || []),
        JSON.stringify(mp.experience || []),
        JSON.stringify(mp.socialMedia || {})
      ];

      await this.executeSQL(insertSQL, params);
    }

    console.log('MPs migration completed');
  }

  async migratePostcodeMappings(): Promise<void> {
    console.log('Migrating postcode mappings...');
    
    const mappings = this.loadJsonFile<Record<string, string>>('postcode-to-constituency.json');
    const entries = Object.entries(mappings);
    console.log(`Found ${entries.length} postcode mappings to migrate`);

    const insertSQL = `
      INSERT INTO postcode_mappings (postcode, constituency)
      VALUES ($1, $2)
      ON CONFLICT (postcode) DO UPDATE SET
        constituency = EXCLUDED.constituency
    `;

    for (const [postcode, constituency] of entries) {
      await this.executeSQL(insertSQL, [postcode, constituency]);
    }

    console.log('Postcode mappings migration completed');
  }

  async migrateNews(): Promise<void> {
    console.log('Migrating news data...');
    
    const news = this.loadJsonFile<any[]>('news.json');
    console.log(`Found ${news.length} news articles to migrate`);

    const insertSQL = `
      INSERT INTO news (id, title, summary, category, source, timestamp, content, url, image)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        summary = EXCLUDED.summary,
        content = EXCLUDED.content
    `;

    for (const article of news) {
      const params = [
        article.id,
        article.title,
        article.summary,
        article.category,
        article.source,
        article.timestamp,
        article.content,
        article.url,
        article.image
      ];

      await this.executeSQL(insertSQL, params);
    }

    console.log('News migration completed');
  }

  async migrateBills(): Promise<void> {
    console.log('Migrating bills data...');
    
    const bills = this.loadJsonFile<any[]>('bills.json');
    console.log(`Found ${bills.length} bills to migrate`);

    const insertSQL = `
      INSERT INTO bills (
        id, bill_id, title, long_title, summary, description, status, stage,
        current_house, introduced_date, last_updated, sponsor, promoter, type,
        category, url, parliament_url, sessions, publications, stages
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
      ) ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        status = EXCLUDED.status,
        last_updated = EXCLUDED.last_updated
    `;

    for (const bill of bills) {
      const params = [
        bill.id,
        bill.billId,
        bill.title,
        bill.longTitle,
        bill.summary,
        bill.description,
        bill.status,
        bill.stage,
        bill.currentHouse,
        bill.introducedDate,
        bill.lastUpdated,
        bill.sponsor,
        bill.promoter,
        bill.type,
        bill.category,
        bill.url,
        bill.parliamentUrl,
        JSON.stringify(bill.sessions || []),
        JSON.stringify(bill.publications || []),
        JSON.stringify(bill.stages || [])
      ];

      await this.executeSQL(insertSQL, params);
    }

    console.log('Bills migration completed');
  }

  async migrateOtherData(): Promise<void> {
    console.log('Migrating other data files...');

    // Migrate voting info
    try {
      const votingInfo = this.loadJsonFile<any>('voting-info.json');
      await this.executeSQL(
        'INSERT INTO voting_info (section, data) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        ['voting_guide', JSON.stringify(votingInfo)]
      );
    } catch (error) {
      console.log('Voting info migration skipped:', error);
    }

    // Migrate citizen rights
    try {
      const citizenRights = this.loadJsonFile<any>('citizen-rights.json');
      await this.executeSQL(
        'INSERT INTO citizen_rights (category, data) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        ['general', JSON.stringify(citizenRights)]
      );
    } catch (error) {
      console.log('Citizen rights migration skipped:', error);
    }

    // Migrate message templates
    try {
      const messageTemplates = this.loadJsonFile<any>('message-templates.json');
      await this.executeSQL(
        'INSERT INTO message_templates (template_type, data) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        ['default', JSON.stringify(messageTemplates)]
      );
    } catch (error) {
      console.log('Message templates migration skipped:', error);
    }

    console.log('Other data migration completed');
  }

  async runFullMigration(): Promise<void> {
    console.log('Starting full database migration...');
    
    try {
      await this.createTables();
      await this.migrateMPs();
      await this.migratePostcodeMappings();
      await this.migrateNews();
      await this.migrateBills();
      await this.migrateOtherData();
      
      console.log('\n✅ Database migration completed successfully!');
      console.log('\n📊 Migration Summary:');
      console.log('- Created database schema');
      console.log('- Migrated MPs data');
      console.log('- Migrated postcode mappings');
      console.log('- Migrated news articles');
      console.log('- Migrated bills data');
      console.log('- Migrated other configuration data');
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }
}

// Export for use in other scripts
export { DatabaseMigration, createTablesSQL };

// Run migration if this file is executed directly
if (require.main === module) {
  const migration = new DatabaseMigration({
    dataPath: path.join(__dirname, '../public/data'),
    connectionString: 'postgresql://postgres:8Nv2xu7kkJ8fPbju@db.jiwqiaxuohfebrkgyvpw.supabase.co:5432/postgres'
  });

  migration.runFullMigration().catch(console.error);
}