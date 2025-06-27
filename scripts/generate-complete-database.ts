import { MPDataGenerator } from './generate-mp-database';
import { PostcodeGenerator } from './generate-postcode-database';
import fs from 'fs/promises';
import path from 'path';

interface CompleteDatabase {
  metadata: {
    generatedAt: string;
    totalMPs: number;
    totalPostcodes: number;
    totalConstituencies: number;
    dataSource: string;
    version: string;
  };
  mps: any[];
  postcodes: any[];
  mapping: {
    postcodeToMP: { [postcode: string]: string };
    mpToPostcodes: { [mpId: string]: string[] };
    constituencyToMP: { [constituency: string]: string };
  };
}

class UKGovernmentDataGenerator {
  private outputDir: string;
  
  constructor(outputDir: string = './data/uk-government-data') {
    this.outputDir = outputDir;
  }

  /**
   * Generate the complete UK Government database
   */
  async generateCompleteDatabase(): Promise<CompleteDatabase> {
    console.log('🏴󠁧󠁢󠁥󠁮󠁧󠁿 UK Government Complete Database Generation');
    console.log('=' .repeat(60));
    console.log('📊 Generating 650 MPs + 1.8M Postcodes Database');
    console.log('=' .repeat(60));
    
    // Step 1: Generate MP database
    console.log('🏛️  Phase 1: Generating MP Database...');
    const mpGenerator = new MPDataGenerator();
    const mps = await mpGenerator.generateMPDatabase();
    
    // Step 2: Generate postcode database
    console.log('📮 Phase 2: Generating Postcode Database...');
    const postcodeGenerator = new PostcodeGenerator();
    const postcodes = await postcodeGenerator.generateCompleteDatabase();
    
    // Step 3: Link postcodes to MPs
    console.log('🔗 Phase 3: Linking Postcodes to MPs...');
    postcodeGenerator.linkPostcodesToMPs(mps);
    
    // Step 4: Create comprehensive mapping
    console.log('🗺️  Phase 4: Creating Comprehensive Mapping...');
    const mapping = this.createComprehensiveMapping(mps, postcodes);
    
    // Step 5: Compile complete database
    const completeDatabase: CompleteDatabase = {
      metadata: {
        generatedAt: new Date().toISOString(),
        totalMPs: mps.length,
        totalPostcodes: postcodes.length,
        totalConstituencies: new Set(mps.map(mp => mp.constituency)).size,
        dataSource: 'UK Parliament API + postcodes.io',
        version: '1.0.0'
      },
      mps,
      postcodes,
      mapping
    };
    
    return completeDatabase;
  }

  /**
   * Create comprehensive mapping between all entities
   */
  private createComprehensiveMapping(mps: any[], postcodes: any[]) {
    const postcodeToMP: { [postcode: string]: string } = {};
    const mpToPostcodes: { [mpId: string]: string[] } = {};
    const constituencyToMP: { [constituency: string]: string } = {};
    
    // Initialize MP to postcodes mapping
    for (const mp of mps) {
      mpToPostcodes[mp.id] = [];
      constituencyToMP[mp.constituency] = mp.id;
    }
    
    // Map postcodes to MPs
    for (const postcode of postcodes) {
      if (postcode.mpId) {
        const cleanPostcode = postcode.postcode.replace(/\s+/g, '').toUpperCase();
        postcodeToMP[cleanPostcode] = postcode.mpId;
        
        if (mpToPostcodes[postcode.mpId]) {
          mpToPostcodes[postcode.mpId].push(postcode.postcode);
        }
      }
    }
    
    return {
      postcodeToMP,
      mpToPostcodes,
      constituencyToMP
    };
  }

  /**
   * Save complete database to multiple formats
   */
  async saveCompleteDatabase(database: CompleteDatabase): Promise<void> {
    console.log(`💾 Saving complete database to ${this.outputDir}...`);
    
    await fs.mkdir(this.outputDir, { recursive: true });
    
    // 1. Save complete database as single file
    const completeFilePath = path.join(this.outputDir, 'uk-government-complete.json');
    await fs.writeFile(
      completeFilePath,
      JSON.stringify(database, null, 2),
      'utf-8'
    );
    console.log(`✅ Saved complete database to ${completeFilePath}`);
    
    // 2. Save individual components
    await this.saveIndividualComponents(database);
    
    // 3. Save optimized lookup files
    await this.saveOptimizedLookups(database);
    
    // 4. Save summary statistics
    await this.saveSummaryStatistics(database);
    
    // 5. Generate documentation
    await this.generateDocumentation(database);
  }

  /**
   * Save individual database components
   */
  private async saveIndividualComponents(database: CompleteDatabase): Promise<void> {
    // MPs only
    const mpsPath = path.join(this.outputDir, 'components', 'mps-all.json');
    await fs.mkdir(path.dirname(mpsPath), { recursive: true });
    await fs.writeFile(mpsPath, JSON.stringify(database.mps, null, 2), 'utf-8');
    
    // Postcodes only
    const postcodesPath = path.join(this.outputDir, 'components', 'postcodes-all.json');
    await fs.writeFile(postcodesPath, JSON.stringify(database.postcodes, null, 2), 'utf-8');
    
    // Mapping only
    const mappingPath = path.join(this.outputDir, 'components', 'mapping-complete.json');
    await fs.writeFile(mappingPath, JSON.stringify(database.mapping, null, 2), 'utf-8');
    
    console.log('✅ Saved individual components');
  }

  /**
   * Save optimized lookup files for fast searching
   */
  private async saveOptimizedLookups(database: CompleteDatabase): Promise<void> {
    const lookupDir = path.join(this.outputDir, 'lookups');
    await fs.mkdir(lookupDir, { recursive: true });
    
    // Postcode lookup (first 4 characters for optimization)
    const postcodeIndex: { [prefix: string]: string[] } = {};
    for (const postcode in database.mapping.postcodeToMP) {
      const prefix = postcode.substring(0, 4);
      if (!postcodeIndex[prefix]) {
        postcodeIndex[prefix] = [];
      }
      postcodeIndex[prefix].push(postcode);
    }
    
    const postcodeIndexPath = path.join(lookupDir, 'postcode-index.json');
    await fs.writeFile(postcodeIndexPath, JSON.stringify(postcodeIndex, null, 2), 'utf-8');
    
    // MP name lookup
    const mpNameIndex: { [name: string]: any } = {};
    for (const mp of database.mps) {
      const nameParts = mp.name.toLowerCase().split(' ');
      for (const part of nameParts) {
        if (part.length > 2) {
          if (!mpNameIndex[part]) {
            mpNameIndex[part] = [];
          }
          mpNameIndex[part].push(mp);
        }
      }
    }
    
    const mpNameIndexPath = path.join(lookupDir, 'mp-name-index.json');
    await fs.writeFile(mpNameIndexPath, JSON.stringify(mpNameIndex, null, 2), 'utf-8');
    
    // Constituency lookup
    const constituencyIndex: { [constituency: string]: any } = {};
    for (const mp of database.mps) {
      constituencyIndex[mp.constituency.toLowerCase()] = mp;
    }
    
    const constituencyIndexPath = path.join(lookupDir, 'constituency-index.json');
    await fs.writeFile(constituencyIndexPath, JSON.stringify(constituencyIndex, null, 2), 'utf-8');
    
    console.log('✅ Saved optimized lookup files');
  }

  /**
   * Save comprehensive statistics
   */
  private async saveSummaryStatistics(database: CompleteDatabase): Promise<void> {
    const stats = {
      overview: database.metadata,
      mpStatistics: this.calculateMPStatistics(database.mps),
      postcodeStatistics: this.calculatePostcodeStatistics(database.postcodes),
      mappingStatistics: this.calculateMappingStatistics(database.mapping),
      performance: {
        avgPostcodesPerMP: database.metadata.totalPostcodes / database.metadata.totalMPs,
        avgMPsPerConstituency: database.metadata.totalMPs / database.metadata.totalConstituencies,
        databaseSizeEstimate: this.estimateDatabaseSize(database)
      }
    };
    
    const statsPath = path.join(this.outputDir, 'statistics.json');
    await fs.writeFile(statsPath, JSON.stringify(stats, null, 2), 'utf-8');
    
    console.log('✅ Saved comprehensive statistics');
  }

  /**
   * Calculate MP statistics
   */
  private calculateMPStatistics(mps: any[]) {
    const partyCount = new Map<string, number>();
    const genderCount = new Map<string, number>();
    const regionCount = new Map<string, number>();
    
    for (const mp of mps) {
      partyCount.set(mp.party, (partyCount.get(mp.party) || 0) + 1);
      genderCount.set(mp.gender, (genderCount.get(mp.gender) || 0) + 1);
      // Extract region from constituency or use default
      const region = this.extractRegion(mp.constituency);
      regionCount.set(region, (regionCount.get(region) || 0) + 1);
    }
    
    return {
      total: mps.length,
      partyBreakdown: Object.fromEntries(partyCount),
      genderBreakdown: Object.fromEntries(genderCount),
      regionBreakdown: Object.fromEntries(regionCount),
      parties: partyCount.size,
      constituencies: mps.length // Should be same as total MPs
    };
  }

  /**
   * Calculate postcode statistics
   */
  private calculatePostcodeStatistics(postcodes: any[]) {
    const areaCount = new Map<string, number>();
    const regionCount = new Map<string, number>();
    const countryCount = new Map<string, number>();
    
    for (const postcode of postcodes) {
      const area = postcode.postcode.split(' ')[0].replace(/\d+$/, '');
      areaCount.set(area, (areaCount.get(area) || 0) + 1);
      regionCount.set(postcode.region, (regionCount.get(postcode.region) || 0) + 1);
      countryCount.set(postcode.country, (countryCount.get(postcode.country) || 0) + 1);
    }
    
    return {
      total: postcodes.length,
      areaBreakdown: Object.fromEntries(areaCount),
      regionBreakdown: Object.fromEntries(regionCount),
      countryBreakdown: Object.fromEntries(countryCount),
      uniqueAreas: areaCount.size,
      uniqueRegions: regionCount.size,
      uniqueCountries: countryCount.size
    };
  }

  /**
   * Calculate mapping statistics
   */
  private calculateMappingStatistics(mapping: any) {
    return {
      totalPostcodeMappings: Object.keys(mapping.postcodeToMP).length,
      totalMPMappings: Object.keys(mapping.mpToPostcodes).length,
      totalConstituencyMappings: Object.keys(mapping.constituencyToMP).length,
      averagePostcodesPerMP: Object.values(mapping.mpToPostcodes).reduce((acc: number, postcodes: any) => acc + postcodes.length, 0) / Object.keys(mapping.mpToPostcodes).length
    };
  }

  /**
   * Extract region from constituency name (simplified)
   */
  private extractRegion(constituency: string): string {
    // This is a simplified mapping - in reality you'd use official data
    const regionKeywords = {
      'London': ['London', 'Westminster', 'Hackney', 'Islington', 'Camden', 'Kensington'],
      'North West': ['Manchester', 'Liverpool', 'Preston', 'Blackpool', 'Bolton', 'Oldham'],
      'Yorkshire': ['Leeds', 'Sheffield', 'York', 'Hull', 'Bradford'],
      'West Midlands': ['Birmingham', 'Coventry', 'Wolverhampton', 'Walsall'],
      'Scotland': ['Glasgow', 'Edinburgh', 'Aberdeen', 'Dundee', 'Stirling'],
      'Wales': ['Cardiff', 'Swansea', 'Newport', 'Wrexham'],
      'Northern Ireland': ['Belfast', 'Derry', 'Armagh', 'Antrim']
    };
    
    for (const [region, keywords] of Object.entries(regionKeywords)) {
      if (keywords.some(keyword => constituency.includes(keyword))) {
        return region;
      }
    }
    
    return 'Other';
  }

  /**
   * Estimate database size
   */
  private estimateDatabaseSize(database: CompleteDatabase): string {
    const jsonString = JSON.stringify(database);
    const sizeInBytes = new Blob([jsonString]).size;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    if (sizeInMB > 1000) {
      return `${(sizeInMB / 1024).toFixed(2)} GB`;
    } else {
      return `${sizeInMB.toFixed(2)} MB`;
    }
  }

  /**
   * Generate comprehensive documentation
   */
  private async generateDocumentation(database: CompleteDatabase): Promise<void> {
    const documentation = `# UK Government Complete Database

## Overview

This comprehensive database contains complete information about:
- **${database.metadata.totalMPs} Members of Parliament** (all 650 UK constituencies)
- **${database.metadata.totalPostcodes.toLocaleString()} UK Postcodes** (comprehensive coverage)
- **Complete Mapping** between postcodes and MPs

Generated on: ${new Date(database.metadata.generatedAt).toLocaleDateString()}
Data Sources: ${database.metadata.dataSource}
Version: ${database.metadata.version}

## Database Structure

### Files Included

#### Main Database
- \`uk-government-complete.json\` - Complete database with all components
- \`statistics.json\` - Comprehensive statistics and analytics

#### Components
- \`components/mps-all.json\` - All 650 MPs with detailed information
- \`components/postcodes-all.json\` - All UK postcodes with constituency mapping
- \`components/mapping-complete.json\` - Complete mapping between entities

#### Optimized Lookups
- \`lookups/postcode-index.json\` - Fast postcode lookup index
- \`lookups/mp-name-index.json\` - MP name search index
- \`lookups/constituency-index.json\` - Constituency lookup index

## MP Data Structure

Each MP record includes:
\`\`\`json
{
  "id": "MP0001",
  "parliamentId": 172,
  "name": "Ms Diane Abbott",
  "fullTitle": "Rt Hon Diane Abbott MP",
  "constituency": "Hackney North and Stoke Newington",
  "constituencyId": 4074,
  "party": "Labour",
  "partyAbbreviation": "Lab",
  "partyColor": "#d50000",
  "gender": "F",
  "membershipStartDate": "1987-06-11T00:00:00",
  "isActive": true,
  "email": "diane.abbott.mp@parliament.uk",
  "phone": "+44 20 7219 3000",
  "website": "https://dianeabbott.org.uk",
  "addresses": [...],
  "thumbnailUrl": "https://members-api.parliament.uk/api/Members/172/Thumbnail",
  "postcodes": ["N16 5ST", "N4 3HB", ...],
  "constituencyPostcodes": [...]
}
\`\`\`

## Postcode Data Structure

Each postcode record includes:
\`\`\`json
{
  "postcode": "SW1A 1AA",
  "constituency": "Cities of London and Westminster",
  "constituencyId": "3536",
  "mpId": "MP0123",
  "region": "London",
  "country": "England",
  "latitude": 51.5014,
  "longitude": -0.1419
}
\`\`\`

## Mapping Structure

\`\`\`json
{
  "postcodeToMP": {
    "SW1A1AA": "MP0123",
    "N165ST": "MP0001"
  },
  "mpToPostcodes": {
    "MP0001": ["N16 5ST", "N4 3HB", ...],
    "MP0123": ["SW1A 1AA", "SW1A 2AA", ...]
  },
  "constituencyToMP": {
    "Hackney North and Stoke Newington": "MP0001",
    "Cities of London and Westminster": "MP0123"
  }
}
\`\`\`

## Usage Examples

### Find MP by Postcode
\`\`\`javascript
const postcode = "SW1A1AA";
const mpId = mapping.postcodeToMP[postcode];
const mp = mps.find(mp => mp.id === mpId);
\`\`\`

### Find Postcodes for MP
\`\`\`javascript
const mpId = "MP0001";
const postcodes = mapping.mpToPostcodes[mpId];
\`\`\`

### Search MP by Name
\`\`\`javascript
const searchTerm = "abbott";
const matches = mpNameIndex[searchTerm] || [];
\`\`\`

## Statistics

- Total MPs: ${database.metadata.totalMPs}
- Total Postcodes: ${database.metadata.totalPostcodes.toLocaleString()}
- Total Constituencies: ${database.metadata.totalConstituencies}
- Average Postcodes per MP: ${Math.round(database.metadata.totalPostcodes / database.metadata.totalMPs).toLocaleString()}

## API Integration

This database can be integrated with:
- **UK Parliament API** for real-time updates
- **Postcodes.io** for postcode validation
- **OS Places API** for detailed geographic data
- **Electoral Commission** for boundary changes

## License

This data is compiled from public sources:
- UK Parliament Members API (Open Government License)
- Postcodes.io (Open Government License)
- Contains public sector information licensed under the Open Government Licence v3.0

## Maintenance

To update the database:
1. Run \`npm run generate-mp-data\`
2. Run \`npm run generate-postcode-data\`
3. Run \`npm run generate-complete-database\`

Last Updated: ${new Date().toLocaleDateString()}
`;

    const docPath = path.join(this.outputDir, 'README.md');
    await fs.writeFile(docPath, documentation, 'utf-8');
    
    console.log('✅ Generated comprehensive documentation');
  }
}

// Main execution
async function main() {
  console.log('🏴󠁧󠁢󠁥󠁮󠁧󠁿 UK GOVERNMENT COMPLETE DATABASE GENERATOR');
  console.log('='.repeat(60));
  console.log('📊 Generating comprehensive database of:');
  console.log('   • 650 Members of Parliament (all constituencies)');
  console.log('   • 1.8 Million UK Postcodes (complete coverage)');
  console.log('   • Complete mapping between postcodes and MPs');
  console.log('='.repeat(60));
  
  const generator = new UKGovernmentDataGenerator('./data/uk-government-complete');
  
  try {
    const startTime = Date.now();
    
    // Generate complete database
    const database = await generator.generateCompleteDatabase();
    
    // Save all formats
    await generator.saveCompleteDatabase(database);
    
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    
    console.log('='.repeat(60));
    console.log('🎉 COMPLETE DATABASE GENERATION SUCCESSFUL!');
    console.log('='.repeat(60));
    console.log(`⏱️  Total Generation Time: ${duration} seconds`);
    console.log(`📊 Database Summary:`);
    console.log(`   • MPs: ${database.metadata.totalMPs.toLocaleString()}`);
    console.log(`   • Postcodes: ${database.metadata.totalPostcodes.toLocaleString()}`);
    console.log(`   • Constituencies: ${database.metadata.totalConstituencies}`);
    console.log(`   • Mappings: ${Object.keys(database.mapping.postcodeToMP).length.toLocaleString()}`);
    console.log('');
    console.log('📁 Files Generated:');
    console.log('   • uk-government-complete.json - Master database');
    console.log('   • components/ - Individual components');
    console.log('   • lookups/ - Optimized search indexes');
    console.log('   • statistics.json - Comprehensive analytics');
    console.log('   • README.md - Complete documentation');
    console.log('');
    console.log('🚀 Ready for integration with your application!');
    
  } catch (error) {
    console.error('❌ Error generating complete database:', error);
    process.exit(1);
  }
}

// Export for use as module
export { UKGovernmentDataGenerator };

// Run if called directly
if (require.main === module) {
  main();
}
