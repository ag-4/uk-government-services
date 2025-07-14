import axios from 'axios';
import { cache } from '../server';

interface PostcodeResult {
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
  result: PostcodeResult;
}

export class PostcodeService {
  private readonly API_BASE = 'https://api.postcodes.io';

  async lookupPostcode(postcode: string): Promise<PostcodeResult | null> {
    const normalizedPostcode = this.normalizePostcode(postcode);
    const cacheKey = `postcode_${normalizedPostcode}`;
    
    // Check cache first
    let result = cache.get(cacheKey);
    if (result) {
      return result as PostcodeResult;
    }

    try {
      const response = await axios.get<PostcodeApiResponse>(
        `${this.API_BASE}/postcodes/${encodeURIComponent(normalizedPostcode)}`,
        {
          timeout: 10000,
          headers: {
            'User-Agent': 'UK-Gov-Services-App/1.0'
          }
        }
      );

      if (response.data.status === 200 && response.data.result) {
        result = response.data.result;
        // Cache for 24 hours (postcodes don't change often)
        cache.set(cacheKey, result, 86400);
        return result as PostcodeResult | null;
      }
    } catch (error) {
      console.error(`Error looking up postcode ${postcode}:`, error);
    }

    return null;
  }

  async getConstituencyFromPostcode(postcode: string): Promise<string | null> {
    const result = await this.lookupPostcode(postcode);
    return result?.parliamentary_constituency || null;
  }

  async validatePostcode(postcode: string): Promise<boolean> {
    const result = await this.lookupPostcode(postcode);
    return result !== null;
  }

  async bulkLookup(postcodes: string[]): Promise<(PostcodeResult | null)[]> {
    const normalizedPostcodes = postcodes.map(p => this.normalizePostcode(p));
    
    try {
      const response = await axios.post(
        `${this.API_BASE}/postcodes`,
        {
          postcodes: normalizedPostcodes
        },
        {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'UK-Gov-Services-App/1.0'
          }
        }
      );

      if (response.data.status === 200 && response.data.result) {
        return response.data.result.map((item: any) => {
          if (item.result) {
            // Cache individual results
            const cacheKey = `postcode_${item.result.postcode}`;
            cache.set(cacheKey, item.result, 86400);
            return item.result;
          }
          return null;
        });
      }
    } catch (error) {
      console.error('Error in bulk postcode lookup:', error);
    }

    // Fallback to individual lookups
    const results = [];
    for (const postcode of postcodes) {
      results.push(await this.lookupPostcode(postcode));
    }
    return results;
  }

  async getNearbyPostcodes(postcode: string, limit: number = 10): Promise<PostcodeResult[]> {
    const normalizedPostcode = this.normalizePostcode(postcode);
    
    try {
      const response = await axios.get(
        `${this.API_BASE}/postcodes/${encodeURIComponent(normalizedPostcode)}/nearest`,
        {
          params: { limit },
          timeout: 10000,
          headers: {
            'User-Agent': 'UK-Gov-Services-App/1.0'
          }
        }
      );

      if (response.data.status === 200 && response.data.result) {
        return response.data.result;
      }
    } catch (error) {
      console.error(`Error finding nearby postcodes for ${postcode}:`, error);
    }

    return [];
  }

  async autocompletePostcode(partial: string): Promise<string[]> {
    const normalizedPartial = this.normalizePostcode(partial);
    
    try {
      const response = await axios.get(
        `${this.API_BASE}/postcodes/${encodeURIComponent(normalizedPartial)}/autocomplete`,
        {
          timeout: 10000,
          headers: {
            'User-Agent': 'UK-Gov-Services-App/1.0'
          }
        }
      );

      if (response.data.status === 200 && response.data.result) {
        return response.data.result;
      }
    } catch (error) {
      console.error(`Error autocompleting postcode ${partial}:`, error);
    }

    return [];
  }

  private normalizePostcode(postcode: string): string {
    // Remove spaces and convert to uppercase
    const normalized = postcode.replace(/\s+/g, '').toUpperCase();
    
    // Add space before last 3 characters if not present
    if (normalized.length >= 5 && !normalized.includes(' ')) {
      return normalized.slice(0, -3) + ' ' + normalized.slice(-3);
    }
    
    return normalized;
  }

  isValidPostcodeFormat(postcode: string): boolean {
    // UK postcode regex pattern
    const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i;
    return postcodeRegex.test(postcode.trim());
  }

  extractOutcode(postcode: string): string {
    const normalized = this.normalizePostcode(postcode);
    const parts = normalized.split(' ');
    return parts[0] || '';
  }

  extractIncode(postcode: string): string {
    const normalized = this.normalizePostcode(postcode);
    const parts = normalized.split(' ');
    return parts[1] || '';
  }
}

export const postcodeService = new PostcodeService();