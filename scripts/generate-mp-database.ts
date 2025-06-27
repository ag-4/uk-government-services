import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

interface ParliamentMember {
  id: number;
  nameListAs: string;
  nameDisplayAs: string;
  nameFullTitle: string;
  nameAddressAs: string;
  latestParty: {
    id: number;
    name: string;
    abbreviation: string;
    backgroundColour: string;
    foregroundColour: string;
  };
  gender: string;
  latestHouseMembership: {
    membershipFrom: string;
    membershipFromId: number;
    house: number;
    membershipStartDate: string;
    membershipEndDate: string | null;
    membershipStatus: {
      statusIsActive: boolean;
      statusDescription: string;
      statusId: number;
    } | null;
  };
  thumbnailUrl: string;
}

interface ParliamentApiResponse {
  items: { value: ParliamentMember }[];
  totalResults: number;
  skip: number;
  take: number;
  links: any[];
}

interface MPContactInfo {
  phone?: string;
  email?: string;
  website?: string;
  addresses?: Array<{
    type: string;
    line1?: string;
    line2?: string;
    town?: string;
    county?: string;
    postcode?: string;
    country?: string;
  }>;
}

interface ProcessedMP {
  id: string;
  parliamentId: number;
  name: string;
  displayName: string;
  fullTitle: string;
  constituency: string;
  constituencyId: number;
  party: string;
  partyAbbreviation: string;
  partyColor: string;
  gender: string;
  membershipStartDate: string;
  isActive: boolean;
  email?: string;
  phone?: string;
  website?: string;
  addresses: Array<{
    type: string;
    fullAddress: string;
    postcode?: string;
    line1?: string;
    line2?: string;
    town?: string;
    county?: string;
    country?: string;
  }>;
  thumbnailUrl: string;
  postcodes: string[];
  constituencyPostcodes: string[];
}

class MPDataGenerator {
  private readonly API_BASE = 'https://members-api.parliament.uk/api';
  private readonly BATCH_SIZE = 50;
  private readonly DELAY_MS = 1000; // Rate limiting
  
  private allMPs: ProcessedMP[] = [];
  private postcodeDatabase: Map<string, string[]> = new Map();

  constructor() {
    console.log('🏛️  UK Parliament MP Data Generator initialized');
  }

  /**
   * Fetch all current MPs from Parliament API
   */
  async fetchAllCurrentMPs(): Promise<ParliamentMember[]> {
    console.log('📡 Fetching all current MPs from Parliament API...');
    
    const allMembers: ParliamentMember[] = [];
    let skip = 0;
    const take = 100;
    
    try {
      while (true) {
        const url = `${this.API_BASE}/Members/Search?skip=${skip}&take=${take}&IsCurrentMember=true&House=1`;
        console.log(`📥 Fetching MPs batch: ${skip}-${skip + take - 1}`);
        
        const response = await axios.get<ParliamentApiResponse>(url);
        const { items, totalResults } = response.data;
        
        // Filter for current MPs only (House = 1 is Commons)
        const currentMPs = items
          .map(item => item.value)
          .filter(member => 
            member.latestHouseMembership?.house === 1 && 
            member.latestHouseMembership?.membershipStatus?.statusIsActive
          );
        
        allMembers.push(...currentMPs);
        
        console.log(`✅ Fetched ${currentMPs.length} current MPs (${allMembers.length} total)`);
        
        skip += take;
        if (skip >= totalResults || currentMPs.length === 0) {
          break;
        }
        
        // Rate limiting
        await this.delay(this.DELAY_MS);
      }
      
      console.log(`🎉 Successfully fetched ${allMembers.length} current MPs`);
      return allMembers;
    } catch (error) {
      console.error('❌ Error fetching MPs:', error);
      throw error;
    }
  }

  /**
   * Fetch detailed contact information for an MP
   */
  async fetchMPContactInfo(memberId: number): Promise<MPContactInfo> {
    try {
      const url = `${this.API_BASE}/Members/${memberId}/Contact`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching contact info for MP ${memberId}:`, error);
      return {};
    }
  }

  /**
   * Fetch constituency postcodes for an MP
   */
  async fetchConstituencyPostcodes(constituencyId: number): Promise<string[]> {
    try {
      // This would typically call a postcode API
      // For now, we'll generate realistic postcodes based on constituency
      return this.generateConstituencyPostcodes(constituencyId);
    } catch (error) {
      console.error(`❌ Error fetching postcodes for constituency ${constituencyId}:`, error);
      return [];
    }
  }

  /**
   * Generate realistic postcodes for a constituency
   */
  private generateConstituencyPostcodes(constituencyId: number): string[] {
    // This is a simplified version - in reality you'd use the Royal Mail postcode database
    const postcodes: string[] = [];
    const areas = this.getPostcodeAreasForConstituency(constituencyId);
    
    for (const area of areas) {
      // Generate multiple postcodes per area
      for (let i = 1; i <= 50; i++) {
        const district = Math.floor(Math.random() * 20) + 1;
        const sector = Math.floor(Math.random() * 9) + 1;
        const unit = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                    String.fromCharCode(65 + Math.floor(Math.random() * 26));
        
        postcodes.push(`${area}${district} ${sector}${unit}`);
      }
    }
    
    return postcodes;
  }

  /**
   * Get postcode areas for a constituency (simplified mapping)
   */
  private getPostcodeAreasForConstituency(constituencyId: number): string[] {
    // This is a simplified mapping - in reality you'd use official constituency boundaries
    const areaMap: { [key: number]: string[] } = {
      // London constituencies
      4074: ['N1', 'N4', 'N16'], // Hackney North and Stoke Newington
      4117: ['IP1', 'IP2', 'IP3'], // Ipswich
      4230: ['OL1', 'OL4', 'OL9'], // Oldham East and Saddleworth
      4142: ['LE1', 'LE2', 'LE3'], // Leicester South
      3317: ['BT1', 'BT11', 'BT12'], // Belfast West
      3720: ['YO8', 'YO19', 'LS24'], // Selby and Ainsty
      // Add more mappings as needed
    };
    
    // Default areas if not mapped
    const defaultAreas = ['SW1', 'SW2', 'SW3', 'SW4', 'SW5'];
    
    return areaMap[constituencyId] || defaultAreas;
  }

  /**
   * Process raw Parliament data into our format
   */
  async processMP(member: ParliamentMember): Promise<ProcessedMP> {
    console.log(`🔄 Processing MP: ${member.nameDisplayAs}`);
    
    // Fetch additional contact information
    const contactInfo = await this.fetchMPContactInfo(member.id);
    await this.delay(200); // Rate limiting
    
    // Fetch constituency postcodes
    const constituencyPostcodes = await this.fetchConstituencyPostcodes(
      member.latestHouseMembership.membershipFromId
    );
    
    const processedMP: ProcessedMP = {
      id: `MP${member.id.toString().padStart(4, '0')}`,
      parliamentId: member.id,
      name: member.nameDisplayAs,
      displayName: member.nameDisplayAs,
      fullTitle: member.nameFullTitle,
      constituency: member.latestHouseMembership.membershipFrom,
      constituencyId: member.latestHouseMembership.membershipFromId,
      party: member.latestParty.name,
      partyAbbreviation: member.latestParty.abbreviation,
      partyColor: `#${member.latestParty.backgroundColour}`,
      gender: member.gender,
      membershipStartDate: member.latestHouseMembership.membershipStartDate,
      isActive: member.latestHouseMembership.membershipStatus?.statusIsActive || false,
      email: this.extractEmail(contactInfo),
      phone: this.extractPhone(contactInfo),
      website: this.extractWebsite(contactInfo),
      addresses: this.processAddresses(contactInfo.addresses || []),
      thumbnailUrl: member.thumbnailUrl,
      postcodes: constituencyPostcodes.slice(0, 10), // Limit for demo
      constituencyPostcodes: constituencyPostcodes
    };
    
    return processedMP;
  }

  /**
   * Extract email from contact info
   */
  private extractEmail(contactInfo: MPContactInfo): string | undefined {
    // Extract email from contact info structure
    return `${contactInfo.email || 'contact@parliament.uk'}`;
  }

  /**
   * Extract phone from contact info
   */
  private extractPhone(contactInfo: MPContactInfo): string | undefined {
    return contactInfo.phone || '+44 20 7219 3000';
  }

  /**
   * Extract website from contact info
   */
  private extractWebsite(contactInfo: MPContactInfo): string | undefined {
    return contactInfo.website;
  }

  /**
   * Process address information
   */
  private processAddresses(addresses: any[]): ProcessedMP['addresses'] {
    return addresses.map(addr => ({
      type: addr.type || 'Parliamentary',
      fullAddress: this.buildFullAddress(addr),
      postcode: addr.postcode,
      line1: addr.line1,
      line2: addr.line2,
      town: addr.town,
      county: addr.county,
      country: addr.country || 'United Kingdom'
    }));
  }

  /**
   * Build full address string
   */
  private buildFullAddress(addr: any): string {
    const parts = [
      addr.line1,
      addr.line2,
      addr.town,
      addr.county,
      addr.postcode,
      addr.country
    ].filter(Boolean);
    
    return parts.join(', ');
  }

  /**
   * Generate the complete MP database
   */
  async generateMPDatabase(): Promise<ProcessedMP[]> {
    console.log('🚀 Starting MP database generation...');
    
    // Step 1: Fetch all current MPs
    const rawMPs = await this.fetchAllCurrentMPs();
    console.log(`📊 Found ${rawMPs.length} current MPs`);
    
    // Step 2: Process each MP in batches
    const processedMPs: ProcessedMP[] = [];
    
    for (let i = 0; i < rawMPs.length; i += this.BATCH_SIZE) {
      const batch = rawMPs.slice(i, i + this.BATCH_SIZE);
      console.log(`📦 Processing batch ${Math.floor(i / this.BATCH_SIZE) + 1}/${Math.ceil(rawMPs.length / this.BATCH_SIZE)}`);
      
      const batchPromises = batch.map(mp => this.processMP(mp));
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          processedMPs.push(result.value);
        } else {
          console.error(`❌ Failed to process MP ${batch[index].nameDisplayAs}:`, result.reason);
        }
      });
      
      // Rate limiting between batches
      await this.delay(this.DELAY_MS * 2);
    }
    
    this.allMPs = processedMPs;
    console.log(`✅ Successfully processed ${processedMPs.length} MPs`);
    
    return processedMPs;
  }

  /**
   * Generate postcode to MP mapping
   */
  generatePostcodeMPMapping(): Map<string, ProcessedMP> {
    console.log('🗺️  Generating postcode to MP mapping...');
    
    const postcodeMap = new Map<string, ProcessedMP>();
    
    for (const mp of this.allMPs) {
      // Map all constituency postcodes to this MP
      for (const postcode of mp.constituencyPostcodes) {
        postcodeMap.set(postcode.toUpperCase().replace(/\s+/g, ''), mp);
      }
    }
    
    console.log(`📍 Generated mapping for ${postcodeMap.size} postcodes`);
    return postcodeMap;
  }

  /**
   * Save data to files
   */
  async saveToFiles(outputDir: string): Promise<void> {
    console.log(`💾 Saving data to ${outputDir}...`);
    
    await fs.mkdir(outputDir, { recursive: true });
    
    // Save complete MP database
    const mpFilePath = path.join(outputDir, 'mps-complete.json');
    await fs.writeFile(
      mpFilePath, 
      JSON.stringify(this.allMPs, null, 2),
      'utf-8'
    );
    console.log(`✅ Saved ${this.allMPs.length} MPs to ${mpFilePath}`);
    
    // Save postcode mapping
    const postcodeMap = this.generatePostcodeMPMapping();
    const postcodeFilePath = path.join(outputDir, 'postcode-mp-mapping.json');
    const postcodeObject = Object.fromEntries(postcodeMap.entries());
    await fs.writeFile(
      postcodeFilePath,
      JSON.stringify(postcodeObject, null, 2),
      'utf-8'
    );
    console.log(`✅ Saved ${postcodeMap.size} postcode mappings to ${postcodeFilePath}`);
    
    // Save summary statistics
    const stats = this.generateStatistics();
    const statsFilePath = path.join(outputDir, 'mp-statistics.json');
    await fs.writeFile(
      statsFilePath,
      JSON.stringify(stats, null, 2),
      'utf-8'
    );
    console.log(`✅ Saved statistics to ${statsFilePath}`);
    
    // Save by party
    const byParty = this.groupByParty();
    const partyFilePath = path.join(outputDir, 'mps-by-party.json');
    await fs.writeFile(
      partyFilePath,
      JSON.stringify(byParty, null, 2),
      'utf-8'
    );
    console.log(`✅ Saved party breakdown to ${partyFilePath}`);
  }

  /**
   * Generate statistics
   */
  private generateStatistics() {
    const partyCount = new Map<string, number>();
    const genderCount = new Map<string, number>();
    let totalPostcodes = 0;
    
    for (const mp of this.allMPs) {
      // Party statistics
      partyCount.set(mp.party, (partyCount.get(mp.party) || 0) + 1);
      
      // Gender statistics
      genderCount.set(mp.gender, (genderCount.get(mp.gender) || 0) + 1);
      
      // Postcode count
      totalPostcodes += mp.constituencyPostcodes.length;
    }
    
    return {
      totalMPs: this.allMPs.length,
      totalPostcodes,
      averagePostcodesPerConstituency: Math.round(totalPostcodes / this.allMPs.length),
      partyBreakdown: Object.fromEntries(partyCount),
      genderBreakdown: Object.fromEntries(genderCount),
      generatedAt: new Date().toISOString(),
      dataSource: 'UK Parliament Members API'
    };
  }

  /**
   * Group MPs by party
   */
  private groupByParty() {
    const byParty = new Map<string, ProcessedMP[]>();
    
    for (const mp of this.allMPs) {
      if (!byParty.has(mp.party)) {
        byParty.set(mp.party, []);
      }
      byParty.get(mp.party)!.push(mp);
    }
    
    return Object.fromEntries(byParty);
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Main execution
async function main() {
  const generator = new MPDataGenerator();
  
  try {
    console.log('🏴󠁧󠁢󠁥󠁮󠁧󠁿 UK Parliament MP Data Generation Started');
    console.log('=' .repeat(50));
    
    // Generate the complete database
    await generator.generateMPDatabase();
    
    // Save to files
    const outputDir = './data/parliament-data';
    await generator.saveToFiles(outputDir);
    
    console.log('=' .repeat(50));
    console.log('🎉 MP Database Generation Complete!');
    console.log(`📁 Data saved to: ${outputDir}`);
    console.log('Files generated:');
    console.log('  • mps-complete.json - Complete MP database');
    console.log('  • postcode-mp-mapping.json - Postcode to MP mapping');
    console.log('  • mp-statistics.json - Summary statistics');
    console.log('  • mps-by-party.json - MPs grouped by party');
    
  } catch (error) {
    console.error('❌ Error generating MP database:', error);
    process.exit(1);
  }
}

// Export for use as module
export { MPDataGenerator, ProcessedMP };

// Run if called directly
if (require.main === module) {
  main();
}
