# UK Government Services - Database Migration Plan

## Overview
This document outlines the plan to migrate the UK Government Services application from static JSON files to a PostgreSQL database to reduce project size and improve performance.

## Current State Analysis

### File Sizes in `public/data/`:
- `mps.json`: **1.28 MB** (largest file - primary migration target)
- `postcode-to-constituency.json`: 0.01 MB
- `bills.json`: 0.01 MB
- `news.json`: 0.01 MB
- Other config files: < 0.01 MB each

### Total Size Reduction: ~1.3 MB

## Database Schema

### 1. MPs Table
```sql
CREATE TABLE mps (
  id VARCHAR(20) PRIMARY KEY,
  parliament_id INTEGER UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  constituency VARCHAR(255) NOT NULL,
  party VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  postcodes JSONB DEFAULT '[]',
  constituency_postcodes JSONB DEFAULT '[]',
  -- Additional fields for complete MP data
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mps_constituency ON mps(constituency);
CREATE INDEX idx_mps_party ON mps(party);
CREATE INDEX idx_mps_postcodes ON mps USING GIN(postcodes);
```

### 2. Postcode Mappings Table
```sql
CREATE TABLE postcode_mappings (
  postcode VARCHAR(10) PRIMARY KEY,
  constituency VARCHAR(255) NOT NULL
);
```

### 3. News Table
```sql
CREATE TABLE news (
  id VARCHAR(20) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  summary TEXT,
  category VARCHAR(100),
  source VARCHAR(100),
  timestamp TIMESTAMP NOT NULL
);
```

### 4. Bills Table
```sql
CREATE TABLE bills (
  id VARCHAR(20) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  summary TEXT,
  status VARCHAR(100),
  current_house VARCHAR(100),
  stages JSONB DEFAULT '[]'
);
```

## Migration Process

### Phase 1: Database Setup
1. ✅ Connect to PostgreSQL server: `postgresql://postgres:8Nv2xu7kkJ8fPbju@db.jiwqiaxuohfebrkgyvpw.supabase.co:5432/postgres`
2. ⏳ Create database schema (tables and indexes)
3. ⏳ Set up proper permissions and constraints

### Phase 2: Data Migration
1. ⏳ Migrate MPs data (1,650+ records)
2. ⏳ Migrate postcode mappings (thousands of entries)
3. ⏳ Migrate news articles
4. ⏳ Migrate bills data
5. ⏳ Migrate configuration data

### Phase 3: Application Updates
1. ✅ Created `src/lib/database.ts` - Database service layer
2. ⏳ Update `src/lib/static-api.ts` to use database service
3. ⏳ Update React components to handle async data loading
4. ⏳ Add loading states and error handling
5. ⏳ Test all functionality

### Phase 4: Cleanup
1. ⏳ Remove large JSON files from `public/data/`
2. ⏳ Update build process
3. ⏳ Deploy updated application

## Benefits

### Immediate Benefits:
- **Reduced Project Size**: ~1.3MB reduction
- **Better Performance**: Database indexes for faster queries
- **Scalability**: Can handle larger datasets
- **Data Integrity**: Database constraints and validation

### Long-term Benefits:
- **Real-time Updates**: Can update MP data without redeployment
- **Advanced Queries**: Complex filtering and searching
- **Analytics**: Better insights into usage patterns
- **Backup & Recovery**: Database-level backup solutions

## Implementation Status

### ✅ Completed:
1. Database connection testing
2. Schema design and SQL scripts
3. Migration scripts creation
4. Database service layer implementation

### ⏳ Next Steps:
1. **Database Setup**: Need write access to create tables
2. **Data Migration**: Execute migration scripts
3. **Application Updates**: Switch from JSON to database
4. **Testing**: Verify all functionality works
5. **Deployment**: Deploy updated application

## Technical Notes

### Database Connection:
- Using Supabase PostgreSQL instance
- Connection string configured in environment
- MCP PostgreSQL server integration ready

### Data Structure Preservation:
- JSONB fields for complex data (postcodes, committees, etc.)
- Maintains existing API compatibility
- Gradual migration approach possible

### Performance Optimizations:
- Strategic indexes on frequently queried fields
- Connection pooling for better performance
- Caching layer for frequently accessed data

## Risk Mitigation

1. **Backup Strategy**: Keep JSON files until migration is verified
2. **Rollback Plan**: Can revert to JSON files if needed
3. **Testing**: Comprehensive testing before removing JSON files
4. **Monitoring**: Database performance monitoring post-migration

## Conclusion

This migration will significantly reduce the project size while improving performance and scalability. The database-first approach provides a solid foundation for future enhancements and real-time data updates.