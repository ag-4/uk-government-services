import axios from 'axios';
import { cache } from '../server';
import fs from 'fs';
import path from 'path';

// TheyWorkForYou API configuration
const TWFY_API_BASE = 'https://www.theyworkforyou.com/api';
const TWFY_API_KEY = process.env.TWFY_API_KEY || 'test'; // Use 'test' for development

interface TWFYPerson {
  person_id: string;
  name: string;
  party: string;
  constituency: string;
  office: Array<{
    dept: string;
    position: string;
    from_date: string;
    to_date: string;
  }>;
  image: string;
  url: string;
}

interface TWFYDebate {
  gid: string;
  hdate: string;
  htime: string;
  subsection_id: string;
  hpos: string;
  speaker: {
    name: string;
    person_id: string;
    constituency: string;
    party: string;
  };
  body: string;
  listurl: string;
}

interface TWFYDivision {
  division_id: string;
  date: string;
  debate_gid: string;
  house: string;
  number: string;
  subject: string;
  yes_total: number;
  no_total: number;
  absent_total: number;
  both_total: number;
  turnout: number;
  majority: number;
  result: string;
}

export class TheyWorkForYouService {
  private async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    try {
      const response = await axios.get(`${TWFY_API_BASE}/${endpoint}`, {
        params: {
          key: TWFY_API_KEY,
          output: 'json',
          ...params
        },
        timeout: 15000,
        headers: {
          'User-Agent': 'UK-Gov-Services-App/1.0'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`TWFY API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Get all current MPs
  async getMPs(): Promise<any[]> {
    const cacheKey = 'local_mps';
    let mps: any[] | undefined = cache.get(cacheKey) as any[];
    
    if (!mps) {
      try {
        // Try to load from local JSON file first
        const mpsFilePath = path.join(process.cwd(), '..', 'public', 'data', 'mps.json');
        
        if (fs.existsSync(mpsFilePath)) {
           console.log('Loading MPs from local database file...');
           const fileContent = fs.readFileSync(mpsFilePath, 'utf8');
           mps = JSON.parse(fileContent) as any[];
           
           // Cache for 24 hours since this is static data
           cache.set(cacheKey, mps, 86400);
           console.log(`Loaded ${mps.length} MPs from local database`);
        } else {
          console.log('Local MP database not found, falling back to TWFY API...');
          // Fallback to TWFY API
          const data = await this.makeRequest('getMPs', {
            date: new Date().toISOString().split('T')[0] // Today's date
          });
          
          mps = data.map((mp: TWFYPerson) => ({
            id: `twfy_${mp.person_id}`,
            parliamentId: parseInt(mp.person_id),
            name: mp.name,
            displayName: mp.name,
            fullTitle: mp.name,
            constituency: mp.constituency,
            party: mp.party,
            partyAbbreviation: this.getPartyAbbreviation(mp.party),
            partyColor: this.getPartyColor(mp.party),
            gender: 'Unknown',
            membershipStartDate: '',
            membershipEndDate: null,
            isActive: true,
            email: `${mp.name.toLowerCase().replace(/\s+/g, '.')}.mp@parliament.uk`,
            phone: '020 7219 3000',
            website: mp.url,
            image: mp.image || '/images/mp-placeholder.jpg',
            thumbnailUrl: mp.image || '/images/mp-placeholder.jpg',
            postcodes: [],
            biography: `${mp.name} is the ${mp.party} MP for ${mp.constituency}.`,
            addresses: [{
              type: 'Parliamentary',
              fullAddress: 'House of Commons, Westminster, London SW1A 0AA',
              postcode: 'SW1A 0AA',
              line1: 'House of Commons',
              line2: 'Westminster',
              town: 'London',
              county: 'Greater London',
              country: 'UK'
            }],
            committees: [],
            socialMedia: {},
            offices: mp.office || []
          }));
          
          // Cache for 6 hours
          cache.set(cacheKey, mps, 21600);
        }
      } catch (error) {
        console.error('Error loading MPs:', error);
        return [];
      }
    }
    
    return mps as any[];
  }

  // Get MP by constituency
  async getMPByConstituency(constituency: string): Promise<any | null> {
    try {
      // First try to get from local database
      const allMPs = await this.getMPs();
      const mp = allMPs.find((mp: any) => 
        mp.constituency.toLowerCase() === constituency.toLowerCase()
      );
      
      if (mp) {
        return mp;
      }
      
      // Fallback to TWFY API if not found in local database
      const data = await this.makeRequest('getMP', {
        constituency: constituency
      });
      
      if (data && data.length > 0) {
        const apiMP = data[0];
        return {
          id: `twfy_${apiMP.person_id}`,
          parliamentId: parseInt(apiMP.person_id),
          name: apiMP.name,
          displayName: apiMP.name,
          constituency: apiMP.constituency,
          party: apiMP.party,
          partyAbbreviation: this.getPartyAbbreviation(apiMP.party),
          partyColor: this.getPartyColor(apiMP.party),
          image: apiMP.image || '/images/mp-placeholder.jpg',
          website: apiMP.url,
          biography: `${apiMP.name} is the ${apiMP.party} MP for ${apiMP.constituency}.`,
          offices: apiMP.office || []
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching MP by constituency:', error);
      return null;
    }
  }

  // Get recent debates
  async getDebates(limit: number = 50): Promise<any[]> {
    const cacheKey = `twfy_debates_${limit}`;
    let debates = cache.get(cacheKey);
    
    if (!debates) {
      try {
        const data = await this.makeRequest('getDebates', {
          type: 'commons',
          date: new Date().toISOString().split('T')[0],
          num: limit
        });
        
        debates = data.map((debate: TWFYDebate) => ({
          id: debate.gid,
          date: debate.hdate,
          time: debate.htime,
          speaker: {
            name: debate.speaker?.name || 'Unknown',
            person_id: debate.speaker?.person_id,
            constituency: debate.speaker?.constituency,
            party: debate.speaker?.party
          },
          content: debate.body,
          url: debate.listurl,
          subsection_id: debate.subsection_id
        }));
        
        // Cache for 1 hour
        cache.set(cacheKey, debates, 3600);
      } catch (error) {
        console.error('Error fetching debates from TWFY:', error);
        return [];
      }
    }
    
    return debates as any[];
  }

  // Get recent divisions (votes)
  async getDivisions(limit: number = 50): Promise<any[]> {
    const cacheKey = `twfy_divisions_${limit}`;
    let divisions = cache.get(cacheKey);
    
    if (!divisions) {
      try {
        const data = await this.makeRequest('getDivisions', {
          house: 'commons',
          date: new Date().toISOString().split('T')[0],
          num: limit
        });
        
        divisions = data.map((division: TWFYDivision) => ({
          id: division.division_id,
          date: division.date,
          house: division.house,
          number: division.number,
          subject: division.subject,
          yes_total: division.yes_total,
          no_total: division.no_total,
          absent_total: division.absent_total,
          turnout: division.turnout,
          majority: division.majority,
          result: division.result,
          debate_gid: division.debate_gid
        }));
        
        // Cache for 2 hours
        cache.set(cacheKey, divisions, 7200);
      } catch (error) {
        console.error('Error fetching divisions from TWFY:', error);
        return [];
      }
    }
    
    return divisions as any[];
  }

  // Search for content
  async search(query: string, limit: number = 20): Promise<any[]> {
    try {
      const data = await this.makeRequest('getHansard', {
        search: query,
        num: limit
      });
      
      return data.map((result: any) => ({
        id: result.gid,
        date: result.hdate,
        speaker: result.speaker,
        content: result.body,
        url: result.listurl,
        relevance: result.relevance || 1
      }));
    } catch (error) {
      console.error('Error searching TWFY:', error);
      return [];
    }
  }

  // Helper methods
  private getPartyAbbreviation(party: string): string {
    const abbreviations: { [key: string]: string } = {
      'Conservative': 'Con',
      'Labour': 'Lab',
      'Liberal Democrat': 'LD',
      'Scottish National Party': 'SNP',
      'Green Party': 'Green',
      'Plaid Cymru': 'PC',
      'Democratic Unionist Party': 'DUP',
      'Sinn Féin': 'SF',
      'Social Democratic and Labour Party': 'SDLP',
      'Alliance Party': 'Alliance',
      'Ulster Unionist Party': 'UUP'
    };
    return abbreviations[party] || party.substring(0, 3).toUpperCase();
  }

  private getPartyColor(party: string): string {
    const colors: { [key: string]: string } = {
      'Conservative': '0087dc',
      'Labour': 'd50000',
      'Liberal Democrat': 'faa61a',
      'Green Party': '6ab023',
      'Scottish National Party': 'fff95d',
      'Plaid Cymru': '008142',
      'Democratic Unionist Party': 'd46a4c',
      'Sinn Féin': '326760',
      'Social Democratic and Labour Party': '99ff66',
      'Alliance Party': 'f6cb2f',
      'Ulster Unionist Party': '9999ff',
      'Independent': '909090'
    };
    return colors[party] || '666666';
  }
}

export const twfyService = new TheyWorkForYouService();