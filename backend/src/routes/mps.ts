import express from 'express';
import axios from 'axios';
import { cache } from '../server';
import fs from 'fs';
import path from 'path';

const router = express.Router();

interface MP {
  id: string;
  parliamentId: number;
  name: string;
  displayName: string;
  fullTitle: string;
  constituency: string;
  party: string;
  partyAbbreviation: string;
  partyColor: string;
  gender: string;
  membershipStartDate: string;
  membershipEndDate: string | null;
  isActive: boolean;
  email: string;
  phone: string;
  website: string;
  image: string;
  thumbnailUrl: string;
  postcodes: string[];
  biography: string;
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
  committees?: string[];
  socialMedia?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    website?: string;
  };
}

// Generate fallback MP data programmatically
function generateFallbackMPs(): MP[] {
  return [
    {
      id: 'MP1',
      parliamentId: 1,
      name: 'Sample MP',
      displayName: 'Sample MP',
      fullTitle: 'The Rt Hon Sample MP',
      constituency: 'Sample Constituency',
      party: 'Conservative',
      partyAbbreviation: 'Con',
      partyColor: '0087dc',
      gender: 'M',
      membershipStartDate: '2019-12-12',
      membershipEndDate: null,
      isActive: true,
      email: 'sample.mp@parliament.uk',
      phone: '020 7219 3000',
      website: '',
      image: '/images/mp-placeholder.jpg',
      thumbnailUrl: '/images/mp-placeholder.jpg',
      postcodes: ['SW1A'],
      biography: 'Sample MP is the Conservative MP for Sample Constituency.',
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
      socialMedia: {}
    }
  ];
}

// Fetch MPs from Parliament API
async function fetchMPsFromParliamentAPI(): Promise<MP[]> {
  try {
    const response = await axios.get('https://members-api.parliament.uk/api/Members/Search', {
      params: {
        House: 'Commons',
        IsCurrentMember: true,
        take: 650
      },
      timeout: 10000
    });

    if (response.data && response.data.items) {
      return response.data.items.map((member: any) => ({
        id: `MP${member.value.id}`,
        parliamentId: member.value.id,
        name: member.value.nameDisplayAs,
        displayName: member.value.nameDisplayAs,
        fullTitle: member.value.nameFullTitle,
        constituency: member.value.latestHouseMembership?.membershipFrom || 'Unknown',
        party: member.value.latestParty?.name || 'Unknown',
        partyAbbreviation: member.value.latestParty?.abbreviation || '',
        partyColor: getPartyColor(member.value.latestParty?.name),
        gender: member.value.gender,
        membershipStartDate: member.value.latestHouseMembership?.membershipStartDate || '',
        membershipEndDate: member.value.latestHouseMembership?.membershipEndDate || null,
        isActive: true,
        email: `${member.value.nameDisplayAs.toLowerCase().replace(/\s+/g, '.')}.mp@parliament.uk`,
        phone: '020 7219 3000',
        website: '',
        image: member.value.thumbnailUrl || '/images/mp-placeholder.jpg',
        thumbnailUrl: member.value.thumbnailUrl || '/images/mp-placeholder.jpg',
        postcodes: ['SW1A'], // Default parliamentary postcode
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
        socialMedia: {}
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching MPs from Parliament API:', error);
    return [];
  }
}

// Get party color
function getPartyColor(partyName: string): string {
  const colors: { [key: string]: string } = {
    'Conservative': '0087dc',
    'Labour': 'd50000',
    'Liberal Democrat': 'faa61a',
    'Green': '6ab023',
    'Scottish National Party': 'fff95d',
    'SNP': 'fff95d',
    'Plaid Cymru': '008142',
    'DUP': 'd46a4c',
    'Sinn Féin': '326760',
    'SDLP': '99ff66',
    'Alliance': 'f6cb2f',
    'UUP': '9999ff',
    'Independent': '909090'
  };
  return colors[partyName] || '666666';
}

// Get MPs with fallback strategy
async function getMPs(): Promise<MP[]> {
  const cacheKey = 'all_mps';
  let mps = cache.get(cacheKey) as MP[];

  if (!mps) {
    // Try Parliament API first
    mps = await fetchMPsFromParliamentAPI();
    
    // If API fails, use programmatic fallback data
    if (mps.length === 0) {
      console.log('Parliament API unavailable, using fallback MP data');
      mps = generateFallbackMPs();
    }
    
    // Cache for 1 hour
    cache.set(cacheKey, mps, 3600);
  }

  return mps;
}

// GET /api/mps - Get all MPs
router.get('/', async (req, res) => {
  try {
    const mps = await getMPs();
    res.json({
      success: true,
      data: mps,
      count: mps.length
    });
  } catch (error) {
    console.error('Error fetching MPs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch MPs'
    });
  }
});

// Search MPs by query parameter
router.get('/search', async (req, res) => {
  const query = (req.query.q || '').toString().toLowerCase().trim();
  const limit = parseInt((req.query.limit || '20').toString());

  if (!query) {
    return res.status(400).json({ error: 'Query parameter (q) is required' });
  }

  const cacheKey = `mp_search_${query}_${limit}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  const mps = await getMPs();

  // Check if query is a postcode format
  const postcodePattern = /^[a-z]{1,2}[0-9][0-9a-z]?\s?[0-9][a-z]{2}$/i;
  const isPostcode = postcodePattern.test(query.replace(/\s+/g, ''));

  let results: MP[];

  if (isPostcode) {
    // Normalize the postcode (remove spaces, uppercase)
    const normalizedPostcode = query.replace(/\s+/g, '').toUpperCase();

    // First, try to find an exact match
    const exactMatch = mps.find((mp: MP) => 
      mp.postcodes?.some(p => p.replace(/\s+/g, '').toUpperCase() === normalizedPostcode)
    );

    if (exactMatch) {
      results = [exactMatch];
    } else {
      // If no exact match, try to match just the outward code (first part of postcode)
      const outwardCode = normalizedPostcode.split(/\d/)[0]; // Extract the letter prefix

      if (outwardCode && outwardCode.length >= 1) {
        results = mps.filter((mp: MP) => 
          mp.postcodes?.some(p => p.replace(/\s+/g, '').toUpperCase().startsWith(outwardCode))
        );
      } else {
        results = [];
      }
    }
  } else {
    // General search across all fields
    results = mps.filter((mp: MP) => {
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

      return searchableText.includes(query);
    });
  }

  // Apply limit
  const limitedResults = results.slice(0, limit);

  cache.set(cacheKey, limitedResults, 600); // Cache for 10 minutes
  res.json(limitedResults);
});

// Find MPs by postcode
router.get('/postcode/:postcode', async (req, res) => {
  const postcode = req.params.postcode.toUpperCase().trim();

  if (!postcode) {
    return res.status(400).json({ error: 'Postcode parameter is required' });
  }

  const cacheKey = `mp_postcode_${postcode}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  const mps = await getMPs();

  // Normalize the postcode (remove spaces, uppercase)
  const normalizedPostcode = postcode.replace(/\s+/g, '');

  // First, try to find an exact match
  const exactMatch = mps.find((mp: MP) => 
    mp.postcodes?.some(p => p.replace(/\s+/g, '').toUpperCase() === normalizedPostcode)
  );

  if (exactMatch) {
    cache.set(cacheKey, exactMatch);
    return res.json(exactMatch);
  }

  // If no exact match, try to match just the outward code (first part of postcode)
  const outwardCode = normalizedPostcode.split(/\d/)[0]; // Extract the letter prefix

  if (outwardCode && outwardCode.length >= 1) {
    const match = mps.find((mp: MP) => 
      mp.postcodes?.some(p => p.replace(/\s+/g, '').toUpperCase().startsWith(outwardCode))
    );

    if (match) {
      cache.set(cacheKey, match);
      return res.json(match);
    }
  }

  res.status(404).json({ error: 'No MP found for this postcode' });
});

// Find MPs by constituency
router.get('/constituency/:name', async (req, res) => {
  const constituencyName = req.params.name.toLowerCase().trim();

  if (!constituencyName) {
    return res.status(400).json({ error: 'Constituency name parameter is required' });
  }

  const cacheKey = `mp_constituency_${constituencyName}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  const mps = await getMPs();
  const results = mps.filter((mp: MP) => mp.constituency.toLowerCase().includes(constituencyName));

  cache.set(cacheKey, results);
  res.json(results);
});

// Find MPs by party
router.get('/party/:name', async (req, res) => {
  const partyName = req.params.name.toLowerCase().trim();

  if (!partyName) {
    return res.status(400).json({ error: 'Party name parameter is required' });
  }

  const cacheKey = `mp_party_${partyName}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  const mps = await getMPs();
  const results = mps.filter((mp: MP) => 
    mp.party.toLowerCase().includes(partyName) || 
    mp.partyAbbreviation.toLowerCase().includes(partyName)
  );

  cache.set(cacheKey, results);
  res.json(results);
});

// GET /api/mps/search - Search MPs by postcode, name, or constituency
router.get('/search', async (req, res) => {
  try {
    const { q, postcode, constituency, party } = req.query;

    if (!q && !postcode && !constituency && !party) {
      return res.status(400).json({
        success: false,
        error: 'Search query required'
      });
    }

    const cacheKey = `mp_search_${JSON.stringify(req.query)}`;
    let results = cache.get(cacheKey);

    if (!results) {
      let filteredMPs = await getMPs();

      if (q) {
        const query = (q as string).toLowerCase();
        filteredMPs = filteredMPs.filter(mp =>
          mp.name.toLowerCase().includes(query) ||
          mp.displayName.toLowerCase().includes(query) ||
          mp.constituency.toLowerCase().includes(query) ||
          mp.party.toLowerCase().includes(query) ||
          mp.biography.toLowerCase().includes(query) ||
          mp.postcodes.some(pc => pc.toLowerCase().includes(query))
        );
      }

      if (postcode) {
        const pc = (postcode as string).toLowerCase().replace(/\s+/g, '');
        filteredMPs = filteredMPs.filter(mp =>
          mp.postcodes.some(pcode => pcode.toLowerCase().replace(/\s+/g, '').includes(pc)) ||
          mp.addresses.some(addr => addr.postcode?.toLowerCase().replace(/\s+/g, '').includes(pc))
        );
      }

      if (constituency) {
        const const_query = (constituency as string).toLowerCase();
        filteredMPs = filteredMPs.filter(mp =>
          mp.constituency.toLowerCase().includes(const_query)
        );
      }

      if (party) {
        const party_query = (party as string).toLowerCase();
        filteredMPs = filteredMPs.filter(mp =>
          mp.party.toLowerCase().includes(party_query) ||
          mp.partyAbbreviation.toLowerCase().includes(party_query)
        );
      }

      results = filteredMPs;
      cache.set(cacheKey, results, 900); // Cache for 15 minutes
    }

    res.json({
      success: true,
      data: results,
      count: (results as MP[]).length
    });
  } catch (error) {
    console.error('Error searching MPs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search MPs'
    });
  }
});

// GET /api/mps/:id - Get MP by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `mp_${id}`;
    let mp = cache.get(cacheKey);

    if (!mp) {
      const allMPs = await getMPs();
      mp = allMPs.find(mp => mp.id === id);
      if (mp) {
        cache.set(cacheKey, mp, 3600); // Cache for 1 hour
      }
    }

    if (!mp) {
      return res.status(404).json({
        success: false,
        error: 'MP not found'
      });
    }

    res.json({
      success: true,
      data: mp
    });
  } catch (error) {
    console.error('Error fetching MP:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch MP'
    });
  }
});

export default router;
