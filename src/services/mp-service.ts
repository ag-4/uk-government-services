import axios from 'axios';

interface MP {
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

interface SearchOptions {
  limit?: number;
  includeInactive?: boolean;
}

export class MPService {
  private mps: MP[] = [];
  private loaded = false;
  private loading = false;

  /**
   * Load MP data from the local JSON file or API
   */
  async loadData(): Promise<void> {
    if (this.loaded || this.loading) return;

    try {
      this.loading = true;

      // Try to load from backend API first
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '/api';
        const response = await axios.get(`${apiUrl}/mps`);
        this.mps = response.data.data || response.data;
      } catch (apiError) {
        console.warn('Failed to load MPs from backend API, trying Parliament API directly:', apiError);

        // Fallback to Parliament API directly
        try {
          const response = await fetch('https://members-api.parliament.uk/api/Members/Search?House=Commons&IsCurrentMember=true&take=650');
          if (response.ok) {
            const data = await response.json();
            this.mps = data.items?.map((member: any) => ({
              id: `MP${member.value.id}`,
              parliamentId: member.value.id,
              name: member.value.nameDisplayAs,
              displayName: member.value.nameDisplayAs,
              fullTitle: member.value.nameFullTitle,
              constituency: member.value.latestHouseMembership?.membershipFrom || 'Unknown',
              party: member.value.latestParty?.name || 'Unknown',
              partyAbbreviation: member.value.latestParty?.abbreviation || '',
              partyColor: member.value.latestParty?.name === 'Conservative' ? '#0087dc' :
                         member.value.latestParty?.name === 'Labour' ? '#d50000' :
                         member.value.latestParty?.name === 'Liberal Democrat' ? '#faa61a' :
                         member.value.latestParty?.name === 'Green' ? '#6ab023' :
                         member.value.latestParty?.name?.includes('SNP') ? '#fff95d' : '#666666',
              gender: member.value.gender,
              membershipStartDate: member.value.latestHouseMembership?.membershipStartDate || '',
              membershipEndDate: member.value.latestHouseMembership?.membershipEndDate || null,
              isActive: true,
              email: `${member.value.nameDisplayAs.toLowerCase().replace(/\s+/g, '.')}.mp@parliament.uk`,
              phone: '020 7219 3000',
              website: '',
              image: member.value.thumbnailUrl || '/images/mp-placeholder.jpg',
              thumbnailUrl: member.value.thumbnailUrl || '/images/mp-placeholder.jpg',
              postcodes: ['SW1A'],
              biography: `${member.value.nameDisplayAs} is the ${member.value.latestParty?.name || ''} MP for ${member.value.latestHouseMembership?.membershipFrom || ''}.`,
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
              constituencyPostcodes: []
            })) || [];
          } else {
            throw new Error('Parliament API failed');
          }
        } catch (parliamentError) {
          console.error('Failed to load from Parliament API:', parliamentError);
          // Final fallback to minimal data
          this.mps = [];
        }
      }

      this.loaded = true;
      console.log(`Loaded ${this.mps.length} MPs`);
    } catch (error) {
      console.error('Error loading MP data:', error);
      throw error;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Find an MP by postcode
   */
  async findMPByPostcode(postcode: string): Promise<MP | null> {
    await this.loadData();

    // Normalize the postcode (remove spaces, uppercase)
    const normalizedPostcode = postcode.replace(/\s+/g, '').toUpperCase();

    // First, try to find an exact match
    const exactMatch = this.mps.find(mp => 
      mp.postcodes.some(p => p.replace(/\s+/g, '').toUpperCase() === normalizedPostcode)
    );

    if (exactMatch) return exactMatch;

    // If no exact match, try to match just the outward code (first part of postcode)
    const outwardCode = normalizedPostcode.split(/\d/)[0]; // Extract the letter prefix

    if (outwardCode && outwardCode.length >= 1) {
      return this.mps.find(mp => 
        mp.postcodes.some(p => p.replace(/\s+/g, '').toUpperCase().startsWith(outwardCode))
      ) || null;
    }

    return null;
  }

  /**
   * Find MPs by name
   */
  async findMPsByName(name: string, options: SearchOptions = {}): Promise<MP[]> {
    await this.loadData();

    const { limit = 10, includeInactive = false } = options;
    const searchTerm = name.toLowerCase().trim();

    const results = this.mps
      .filter(mp => {
        if (!includeInactive && !mp.isActive) return false;

        return (
          mp.name.toLowerCase().includes(searchTerm) ||
          mp.displayName.toLowerCase().includes(searchTerm) ||
          mp.fullTitle.toLowerCase().includes(searchTerm)
        );
      })
      .slice(0, limit);

    return results;
  }

  /**
   * Find MPs by constituency
   */
  async findMPsByConstituency(constituency: string, options: SearchOptions = {}): Promise<MP[]> {
    await this.loadData();

    const { limit = 10, includeInactive = false } = options;
    const searchTerm = constituency.toLowerCase().trim();

    const results = this.mps
      .filter(mp => {
        if (!includeInactive && !mp.isActive) return false;
        return mp.constituency.toLowerCase().includes(searchTerm);
      })
      .slice(0, limit);

    return results;
  }

  /**
   * Find MPs by party
   */
  async findMPsByParty(party: string, options: SearchOptions = {}): Promise<MP[]> {
    await this.loadData();

    const { limit = 50, includeInactive = false } = options;
    const searchTerm = party.toLowerCase().trim();

    const results = this.mps
      .filter(mp => {
        if (!includeInactive && !mp.isActive) return false;

        return (
          mp.party.toLowerCase().includes(searchTerm) ||
          mp.partyAbbreviation.toLowerCase().includes(searchTerm)
        );
      })
      .slice(0, limit);

    return results;
  }

  /**
   * General search across all fields
   */
  async searchMPs(query: string, options: SearchOptions = {}): Promise<MP[]> {
    await this.loadData();

    const { limit = 20, includeInactive = false } = options;
    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm) {
      return this.mps
        .filter(mp => includeInactive || mp.isActive)
        .slice(0, limit);
    }

    // Try to interpret if this is a postcode search
    const postcodePattern = /^[a-z]{1,2}[0-9][0-9a-z]?\s?[0-9][a-z]{2}$/i;
    if (postcodePattern.test(searchTerm.replace(/\s+/g, ''))) {
      const mp = await this.findMPByPostcode(searchTerm);
      return mp ? [mp] : [];
    }

    // General search across all fields
    const results = this.mps
      .filter(mp => {
        if (!includeInactive && !mp.isActive) return false;

        // Search in all searchable fields
        const searchableText = [
          mp.name,
          mp.displayName,
          mp.fullTitle,
          mp.constituency,
          mp.party,
          mp.partyAbbreviation,
          ...(mp.postcodes || [])
        ].join(' ').toLowerCase();

        return searchableText.includes(searchTerm);
      })
      .slice(0, limit);

    return results;
  }

  /**
   * Get all MPs
   */
  async getAllMPs(options: SearchOptions = {}): Promise<MP[]> {
    await this.loadData();

    const { includeInactive = false } = options;

    return this.mps.filter(mp => includeInactive || mp.isActive);
  }

  /**
   * Get MP by ID
   */
  async getMPById(id: string): Promise<MP | null> {
    await this.loadData();
    return this.mps.find(mp => mp.id === id) || null;
  }
}

// Create and export a singleton instance
export const mpService = new MPService();
