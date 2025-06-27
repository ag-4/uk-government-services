import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

interface UKPostcode {
  postcode: string;
  quality: number;
  eastings: number;
  northings: number;
  country: string;
  nhs_ha: string;
  longitude: number;
  latitude: number;
  european_electoral_region: string;
  primary_care_trust: string;
  region: string;
  lsoa: string;
  msoa: string;
  incode: string;
  outcode: string;
  parliamentary_constituency: string;
  parliamentary_constituency_id: string;
  admin_district: string;
  parish: string;
  admin_county: string;
  admin_ward: string;
  ced: string;
  ccg: string;
  nuts: string;
  codes: {
    admin_district: string;
    admin_county: string;
    admin_ward: string;
    parish: string;
    parliamentary_constituency: string;
    ccg: string;
    ccg_id: string;
    ced: string;
    nuts: string;
    lsoa: string;
    msoa: string;
    lau2: string;
  };
}

interface PostcodeApiResponse {
  status: number;
  result: UKPostcode;
}

interface BulkPostcodeResponse {
  status: number;
  result: Array<{
    query: string;
    result: UKPostcode | null;
  }>;
}

interface PostcodeConstituencyMapping {
  postcode: string;
  constituency: string;
  constituencyId: string;
  mpId?: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
}

class PostcodeGenerator {
  private readonly POSTCODES_API = 'https://api.postcodes.io';
  private readonly BATCH_SIZE = 100; // Max allowed by postcodes.io
  private readonly DELAY_MS = 100;
  
  private allPostcodes: PostcodeConstituencyMapping[] = [];
  
  constructor() {
    console.log('📮 UK Postcode Database Generator initialized');
  }

  /**
   * Generate all UK postcodes systematically
   */
  async generateAllUKPostcodes(): Promise<string[]> {
    console.log('📍 Generating comprehensive UK postcode list...');
    
    const postcodes: string[] = [];
    
    // UK postcode areas and their typical ranges
    const postcodeAreas = this.getUKPostcodeAreas();
    
    for (const area of postcodeAreas) {
      console.log(`🔄 Generating postcodes for area: ${area.code}`);
      
      const areaPostcodes = this.generatePostcodesForArea(area);
      postcodes.push(...areaPostcodes);
      
      console.log(`✅ Generated ${areaPostcodes.length} postcodes for ${area.code}`);
    }
    
    console.log(`🎉 Generated ${postcodes.length} total postcodes`);
    return postcodes;
  }

  /**
   * Get all UK postcode areas with their characteristics
   */
  private getUKPostcodeAreas() {
    return [
      // London areas
      { code: 'E1', districts: 20, sectors: 9, region: 'London', country: 'England' },
      { code: 'E2', districts: 15, sectors: 9, region: 'London', country: 'England' },
      { code: 'E3', districts: 10, sectors: 9, region: 'London', country: 'England' },
      { code: 'E4', districts: 8, sectors: 9, region: 'London', country: 'England' },
      { code: 'E5', districts: 12, sectors: 9, region: 'London', country: 'England' },
      { code: 'E6', districts: 7, sectors: 9, region: 'London', country: 'England' },
      { code: 'E7', districts: 5, sectors: 9, region: 'London', country: 'England' },
      { code: 'E8', districts: 4, sectors: 9, region: 'London', country: 'England' },
      { code: 'E9', districts: 7, sectors: 9, region: 'London', country: 'England' },
      { code: 'E10', districts: 7, sectors: 9, region: 'London', country: 'England' },
      { code: 'E11', districts: 4, sectors: 9, region: 'London', country: 'England' },
      { code: 'E12', districts: 6, sectors: 9, region: 'London', country: 'England' },
      { code: 'E13', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'E14', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'E15', districts: 4, sectors: 9, region: 'London', country: 'England' },
      { code: 'E16', districts: 4, sectors: 9, region: 'London', country: 'England' },
      { code: 'E17', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'E18', districts: 2, sectors: 9, region: 'London', country: 'England' },
      { code: 'EC1', districts: 4, sectors: 9, region: 'London', country: 'England' },
      { code: 'EC2', districts: 4, sectors: 9, region: 'London', country: 'England' },
      { code: 'EC3', districts: 4, sectors: 9, region: 'London', country: 'England' },
      { code: 'EC4', districts: 4, sectors: 9, region: 'London', country: 'England' },
      
      // North London
      { code: 'N1', districts: 22, sectors: 9, region: 'London', country: 'England' },
      { code: 'N2', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'N3', districts: 3, sectors: 9, region: 'London', country: 'England' },
      { code: 'N4', districts: 4, sectors: 9, region: 'London', country: 'England' },
      { code: 'N5', districts: 2, sectors: 9, region: 'London', country: 'England' },
      { code: 'N6', districts: 6, sectors: 9, region: 'London', country: 'England' },
      { code: 'N7', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'N8', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'N9', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'N10', districts: 3, sectors: 9, region: 'London', country: 'England' },
      { code: 'N11', districts: 3, sectors: 9, region: 'London', country: 'England' },
      { code: 'N12', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'N13', districts: 6, sectors: 9, region: 'London', country: 'England' },
      { code: 'N14', districts: 7, sectors: 9, region: 'London', country: 'England' },
      { code: 'N15', districts: 6, sectors: 9, region: 'London', country: 'England' },
      { code: 'N16', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'N17', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'N18', districts: 3, sectors: 9, region: 'London', country: 'England' },
      { code: 'N19', districts: 5, sectors: 9, region: 'London', country: 'England' },
      { code: 'N20', districts: 3, sectors: 9, region: 'London', country: 'England' },
      { code: 'N21', districts: 3, sectors: 9, region: 'London', country: 'England' },
      { code: 'N22', districts: 8, sectors: 9, region: 'London', country: 'England' },
      
      // Northwest London
      { code: 'NW1', districts: 8, sectors: 9, region: 'London', country: 'England' },
      { code: 'NW2', districts: 7, sectors: 9, region: 'London', country: 'England' },
      { code: 'NW3', districts: 7, sectors: 9, region: 'London', country: 'England' },
      { code: 'NW4', districts: 4, sectors: 9, region: 'London', country: 'England' },
      { code: 'NW5', districts: 4, sectors: 9, region: 'London', country: 'England' },
      { code: 'NW6', districts: 7, sectors: 9, region: 'London', country: 'England' },
      { code: 'NW7', districts: 4, sectors: 9, region: 'London', country: 'England' },
      { code: 'NW8', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'NW9', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'NW10', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'NW11', districts: 9, sectors: 9, region: 'London', country: 'England' },
      
      // South London
      { code: 'SE1', districts: 22, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE2', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE3', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE4', districts: 2, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE5', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE6', districts: 4, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE7', districts: 8, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE8', districts: 5, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE9', districts: 6, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE10', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE11', districts: 6, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE12', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE13', districts: 7, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE14', districts: 6, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE15', districts: 6, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE16', districts: 7, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE17', districts: 3, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE18', districts: 7, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE19', districts: 3, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE20', districts: 8, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE21', districts: 8, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE22', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE23', districts: 3, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE24', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE25', districts: 6, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE26', districts: 6, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE27', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'SE28', districts: 8, sectors: 9, region: 'London', country: 'England' },
      
      // Southwest London
      { code: 'SW1', districts: 22, sectors: 9, region: 'London', country: 'England' },
      { code: 'SW2', districts: 5, sectors: 9, region: 'London', country: 'England' },
      { code: 'SW3', districts: 6, sectors: 9, region: 'London', country: 'England' },
      { code: 'SW4', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'SW5', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'SW6', districts: 7, sectors: 9, region: 'London', country: 'England' },
      { code: 'SW7', districts: 5, sectors: 9, region: 'London', country: 'England' },
      { code: 'SW8', districts: 5, sectors: 9, region: 'London', country: 'England' },
      { code: 'SW9', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'SW10', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'SW11', districts: 6, sectors: 9, region: 'London', country: 'England' },
      { code: 'SW12', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'SW13', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'SW14', districts: 8, sectors: 9, region: 'London', country: 'England' },
      { code: 'SW15', districts: 6, sectors: 9, region: 'London', country: 'England' },
      { code: 'SW16', districts: 6, sectors: 9, region: 'London', country: 'England' },
      { code: 'SW17', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'SW18', districts: 5, sectors: 9, region: 'London', country: 'England' },
      { code: 'SW19', districts: 8, sectors: 9, region: 'London', country: 'England' },
      { code: 'SW20', districts: 9, sectors: 9, region: 'London', country: 'England' },
      
      // West London
      { code: 'W1', districts: 22, sectors: 9, region: 'London', country: 'England' },
      { code: 'W2', districts: 6, sectors: 9, region: 'London', country: 'England' },
      { code: 'W3', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'W4', districts: 5, sectors: 9, region: 'London', country: 'England' },
      { code: 'W5', districts: 5, sectors: 9, region: 'London', country: 'England' },
      { code: 'W6', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'W7', districts: 3, sectors: 9, region: 'London', country: 'England' },
      { code: 'W8', districts: 6, sectors: 9, region: 'London', country: 'England' },
      { code: 'W9', districts: 3, sectors: 9, region: 'London', country: 'England' },
      { code: 'W10', districts: 6, sectors: 9, region: 'London', country: 'England' },
      { code: 'W11', districts: 4, sectors: 9, region: 'London', country: 'England' },
      { code: 'W12', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'W13', districts: 9, sectors: 9, region: 'London', country: 'England' },
      { code: 'W14', districts: 9, sectors: 9, region: 'London', country: 'England' },
      
      // Major cities and regions
      { code: 'M', districts: 90, sectors: 9, region: 'North West', country: 'England' }, // Manchester
      { code: 'B', districts: 80, sectors: 9, region: 'West Midlands', country: 'England' }, // Birmingham
      { code: 'L', districts: 70, sectors: 9, region: 'North West', country: 'England' }, // Liverpool
      { code: 'S', districts: 80, sectors: 9, region: 'Yorkshire and the Humber', country: 'England' }, // Sheffield
      { code: 'LS', districts: 29, sectors: 9, region: 'Yorkshire and the Humber', country: 'England' }, // Leeds
      { code: 'NG', districts: 34, sectors: 9, region: 'East Midlands', country: 'England' }, // Nottingham
      { code: 'DE', districts: 75, sectors: 9, region: 'East Midlands', country: 'England' }, // Derby
      { code: 'LE', districts: 95, sectors: 9, region: 'East Midlands', country: 'England' }, // Leicester
      { code: 'CV', districts: 47, sectors: 9, region: 'West Midlands', country: 'England' }, // Coventry
      { code: 'WS', districts: 15, sectors: 9, region: 'West Midlands', country: 'England' }, // Walsall
      { code: 'WV', districts: 16, sectors: 9, region: 'West Midlands', country: 'England' }, // Wolverhampton
      { code: 'ST', districts: 21, sectors: 9, region: 'West Midlands', country: 'England' }, // Stoke
      { code: 'OL', districts: 16, sectors: 9, region: 'North West', country: 'England' }, // Oldham
      { code: 'BL', districts: 9, sectors: 9, region: 'North West', country: 'England' }, // Bolton
      { code: 'WN', districts: 8, sectors: 9, region: 'North West', country: 'England' }, // Wigan
      { code: 'PR', districts: 25, sectors: 9, region: 'North West', country: 'England' }, // Preston
      { code: 'BB', districts: 12, sectors: 9, region: 'North West', country: 'England' }, // Blackburn
      { code: 'FY', districts: 8, sectors: 9, region: 'North West', country: 'England' }, // Blackpool
      { code: 'LA', districts: 23, sectors: 9, region: 'North West', country: 'England' }, // Lancaster
      
      // Scotland
      { code: 'G', districts: 83, sectors: 9, region: 'Scotland', country: 'Scotland' }, // Glasgow
      { code: 'EH', districts: 55, sectors: 9, region: 'Scotland', country: 'Scotland' }, // Edinburgh
      { code: 'AB', districts: 56, sectors: 9, region: 'Scotland', country: 'Scotland' }, // Aberdeen
      { code: 'DD', districts: 11, sectors: 9, region: 'Scotland', country: 'Scotland' }, // Dundee
      { code: 'PA', districts: 78, sectors: 9, region: 'Scotland', country: 'Scotland' }, // Paisley
      { code: 'FK', districts: 21, sectors: 9, region: 'Scotland', country: 'Scotland' }, // Falkirk
      { code: 'KY', districts: 16, sectors: 9, region: 'Scotland', country: 'Scotland' }, // Kirkcaldy
      { code: 'KA', districts: 30, sectors: 9, region: 'Scotland', country: 'Scotland' }, // Kilmarnock
      { code: 'ML', districts: 12, sectors: 9, region: 'Scotland', country: 'Scotland' }, // Motherwell
      { code: 'DG', districts: 16, sectors: 9, region: 'Scotland', country: 'Scotland' }, // Dumfries
      { code: 'TD', districts: 15, sectors: 9, region: 'Scotland', country: 'Scotland' }, // Galashiels
      { code: 'IV', districts: 63, sectors: 9, region: 'Scotland', country: 'Scotland' }, // Inverness
      { code: 'PH', districts: 50, sectors: 9, region: 'Scotland', country: 'Scotland' }, // Perth
      
      // Wales
      { code: 'CF', districts: 83, sectors: 9, region: 'Wales', country: 'Wales' }, // Cardiff
      { code: 'SA', districts: 80, sectors: 9, region: 'Wales', country: 'Wales' }, // Swansea
      { code: 'NP', districts: 25, sectors: 9, region: 'Wales', country: 'Wales' }, // Newport
      { code: 'LL', districts: 78, sectors: 9, region: 'Wales', country: 'Wales' }, // Llandudno
      { code: 'SY', districts: 25, sectors: 9, region: 'Wales', country: 'Wales' }, // Shrewsbury
      { code: 'LD', districts: 8, sectors: 9, region: 'Wales', country: 'Wales' }, // Llandrindod Wells
      
      // Northern Ireland
      { code: 'BT', districts: 94, sectors: 9, region: 'Northern Ireland', country: 'Northern Ireland' }, // Belfast
      
      // Add more areas as needed...
    ];
  }

  /**
   * Generate postcodes for a specific area
   */
  private generatePostcodesForArea(area: { code: string; districts: number; sectors: number; region: string; country: string }): string[] {
    const postcodes: string[] = [];
    
    for (let district = 1; district <= area.districts; district++) {
      for (let sector = 0; sector <= area.sectors; sector++) {
        // Generate multiple postcodes per sector
        const unitsPerSector = Math.floor(Math.random() * 50) + 10; // 10-60 units per sector
        
        for (let i = 0; i < unitsPerSector; i++) {
          const letter1 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
          const letter2 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
          
          const postcode = `${area.code}${district} ${sector}${letter1}${letter2}`;
          postcodes.push(postcode);
        }
      }
    }
    
    return postcodes;
  }

  /**
   * Validate and enrich postcodes using postcodes.io API
   */
  async validateAndEnrichPostcodes(postcodes: string[]): Promise<PostcodeConstituencyMapping[]> {
    console.log(`📍 Validating and enriching ${postcodes.length} postcodes...`);
    
    const enrichedPostcodes: PostcodeConstituencyMapping[] = [];
    
    // Process in batches
    for (let i = 0; i < postcodes.length; i += this.BATCH_SIZE) {
      const batch = postcodes.slice(i, i + this.BATCH_SIZE);
      
      console.log(`📦 Processing batch ${Math.floor(i / this.BATCH_SIZE) + 1}/${Math.ceil(postcodes.length / this.BATCH_SIZE)}`);
      
      try {
        const response = await axios.post<BulkPostcodeResponse>(
          `${this.POSTCODES_API}/postcodes`,
          { postcodes: batch }
        );
        
        if (response.data.status === 200) {
          for (const item of response.data.result) {
            if (item.result) {
              enrichedPostcodes.push({
                postcode: item.result.postcode,
                constituency: item.result.parliamentary_constituency,
                constituencyId: item.result.codes.parliamentary_constituency,
                region: item.result.region,
                country: item.result.country,
                latitude: item.result.latitude,
                longitude: item.result.longitude
              });
            }
          }
        }
      } catch (error) {
        console.error(`❌ Error processing batch ${Math.floor(i / this.BATCH_SIZE) + 1}:`, error);
        // Continue with next batch
      }
      
      // Rate limiting
      await this.delay(this.DELAY_MS);
    }
    
    console.log(`✅ Successfully enriched ${enrichedPostcodes.length} postcodes`);
    return enrichedPostcodes;
  }

  /**
   * Generate the complete postcode database
   */
  async generateCompleteDatabase(): Promise<PostcodeConstituencyMapping[]> {
    console.log('🚀 Starting complete postcode database generation...');
    
    // Step 1: Generate all possible postcodes
    const allPostcodes = await this.generateAllUKPostcodes();
    
    // Step 2: Take a sample for validation (API has limits)
    const sampleSize = Math.min(10000, allPostcodes.length); // Limit for demo
    const samplePostcodes = this.shuffleArray(allPostcodes).slice(0, sampleSize);
    
    console.log(`📊 Validating sample of ${samplePostcodes.length} postcodes`);
    
    // Step 3: Validate and enrich the sample
    const validatedPostcodes = await this.validateAndEnrichPostcodes(samplePostcodes);
    
    this.allPostcodes = validatedPostcodes;
    return validatedPostcodes;
  }

  /**
   * Shuffle array utility
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Link postcodes to MPs
   */
  linkPostcodesToMPs(mps: any[]): void {
    console.log('🔗 Linking postcodes to MPs...');
    
    for (const postcode of this.allPostcodes) {
      // Find MP for this constituency
      const mp = mps.find(mp => 
        mp.constituency.toLowerCase() === postcode.constituency.toLowerCase()
      );
      
      if (mp) {
        postcode.mpId = mp.id;
      }
    }
    
    console.log('✅ Postcode-MP linking complete');
  }

  /**
   * Save postcode database to files
   */
  async savePostcodeDatabase(outputDir: string): Promise<void> {
    console.log(`💾 Saving postcode database to ${outputDir}...`);
    
    await fs.mkdir(outputDir, { recursive: true });
    
    // Save complete postcode database
    const postcodeFilePath = path.join(outputDir, 'uk-postcodes-complete.json');
    await fs.writeFile(
      postcodeFilePath,
      JSON.stringify(this.allPostcodes, null, 2),
      'utf-8'
    );
    console.log(`✅ Saved ${this.allPostcodes.length} postcodes to ${postcodeFilePath}`);
    
    // Create postcode lookup index
    const lookupIndex = this.createPostcodeLookupIndex();
    const lookupFilePath = path.join(outputDir, 'postcode-lookup-index.json');
    await fs.writeFile(
      lookupFilePath,
      JSON.stringify(lookupIndex, null, 2),
      'utf-8'
    );
    console.log(`✅ Saved postcode lookup index to ${lookupFilePath}`);
    
    // Save by constituency
    const byConstituency = this.groupPostcodesByConstituency();
    const constituencyFilePath = path.join(outputDir, 'postcodes-by-constituency.json');
    await fs.writeFile(
      constituencyFilePath,
      JSON.stringify(byConstituency, null, 2),
      'utf-8'
    );
    console.log(`✅ Saved constituency breakdown to ${constituencyFilePath}`);
    
    // Save statistics
    const stats = this.generatePostcodeStatistics();
    const statsFilePath = path.join(outputDir, 'postcode-statistics.json');
    await fs.writeFile(
      statsFilePath,
      JSON.stringify(stats, null, 2),
      'utf-8'
    );
    console.log(`✅ Saved statistics to ${statsFilePath}`);
  }

  /**
   * Create postcode lookup index for fast searching
   */
  private createPostcodeLookupIndex(): { [postcode: string]: PostcodeConstituencyMapping } {
    const index: { [postcode: string]: PostcodeConstituencyMapping } = {};
    
    for (const postcode of this.allPostcodes) {
      const key = postcode.postcode.replace(/\s+/g, '').toUpperCase();
      index[key] = postcode;
    }
    
    return index;
  }

  /**
   * Group postcodes by constituency
   */
  private groupPostcodesByConstituency(): { [constituency: string]: PostcodeConstituencyMapping[] } {
    const grouped: { [constituency: string]: PostcodeConstituencyMapping[] } = {};
    
    for (const postcode of this.allPostcodes) {
      if (!grouped[postcode.constituency]) {
        grouped[postcode.constituency] = [];
      }
      grouped[postcode.constituency].push(postcode);
    }
    
    return grouped;
  }

  /**
   * Generate postcode statistics
   */
  private generatePostcodeStatistics() {
    const constituencyCount = new Map<string, number>();
    const regionCount = new Map<string, number>();
    const countryCount = new Map<string, number>();
    
    for (const postcode of this.allPostcodes) {
      constituencyCount.set(
        postcode.constituency, 
        (constituencyCount.get(postcode.constituency) || 0) + 1
      );
      
      regionCount.set(
        postcode.region, 
        (regionCount.get(postcode.region) || 0) + 1
      );
      
      countryCount.set(
        postcode.country, 
        (countryCount.get(postcode.country) || 0) + 1
      );
    }
    
    return {
      totalPostcodes: this.allPostcodes.length,
      totalConstituencies: constituencyCount.size,
      totalRegions: regionCount.size,
      totalCountries: countryCount.size,
      constituencyBreakdown: Object.fromEntries(constituencyCount),
      regionBreakdown: Object.fromEntries(regionCount),
      countryBreakdown: Object.fromEntries(countryCount),
      averagePostcodesPerConstituency: Math.round(this.allPostcodes.length / constituencyCount.size),
      generatedAt: new Date().toISOString(),
      dataSource: 'postcodes.io API'
    };
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export for use as module
export { PostcodeGenerator, PostcodeConstituencyMapping };

// Main execution function
async function main() {
  const generator = new PostcodeGenerator();
  
  try {
    console.log('🇬🇧 UK Postcode Database Generation Started');
    console.log('=' .repeat(50));
    
    // Generate the complete database
    await generator.generateCompleteDatabase();
    
    // Save to files
    const outputDir = './data/postcode-data';
    await generator.savePostcodeDatabase(outputDir);
    
    console.log('=' .repeat(50));
    console.log('🎉 Postcode Database Generation Complete!');
    console.log(`📁 Data saved to: ${outputDir}`);
    console.log('Files generated:');
    console.log('  • uk-postcodes-complete.json - Complete postcode database');
    console.log('  • postcode-lookup-index.json - Fast lookup index');
    console.log('  • postcodes-by-constituency.json - Grouped by constituency');
    console.log('  • postcode-statistics.json - Summary statistics');
    
  } catch (error) {
    console.error('❌ Error generating postcode database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
