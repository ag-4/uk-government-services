import express from 'express';
import axios from 'axios';
import { cache } from '../server';

const router = express.Router();

interface MP {
  id: string;
  name: string;
  constituency: string;
  party: string;
  email: string;
  phone: string;
  postcode: string;
  fullPostcodes: string[];
  address: string;
  website: string;
  image: string;
  biography: string;
  committees?: string[];
  socialMedia?: {
    twitter?: string;
    facebook?: string;
  };
}

// Mock MP data (in production, this would come from a database)
const mockMPs: MP[] = [
  {
    id: "MP001",
    name: "Rishi Sunak",
    constituency: "Richmond (Yorks)",
    party: "Conservative",
    email: "rishi.sunak.mp@parliament.uk",
    phone: "+44 1748 850 580",
    postcode: "DL10",
    fullPostcodes: ["DL10 4", "DL10 5", "DL10 6", "DL10 7", "DL11 6", "DL11 7"],
    address: "83 Kings Road, Richmond, North Yorkshire DL10 4PW",
    website: "https://www.rishisunak.com",
    image: "/images/mp-placeholder.jpg",
    biography: "Chancellor of the Exchequer 2020-2022, Prime Minister 2022-2024. MP for Richmond (Yorks) since 2015.",
    committees: ["Treasury Select Committee"],
    socialMedia: {
      twitter: "@RishiSunak",
      facebook: "RishiSunakMP"
    }
  }
  // Add more MPs as needed
];

// GET /api/mps - Get all MPs
router.get('/', async (req, res) => {
  try {
    const cacheKey = 'all_mps';
    let mps = cache.get(cacheKey);

    if (!mps) {
      // In production, fetch from database or Parliament API
      mps = mockMPs;
      cache.set(cacheKey, mps, 3600); // Cache for 1 hour
    }

    res.json({
      success: true,
      data: mps,
      count: (mps as MP[]).length
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
router.get('/search', (req, res) => {
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

  const mps = getMPs();

  // Check if query is a postcode format
  const postcodePattern = /^[a-z]{1,2}[0-9][0-9a-z]?\s?[0-9][a-z]{2}$/i;
  const isPostcode = postcodePattern.test(query.replace(/\s+/g, ''));

  let results;

  if (isPostcode) {
    // Normalize the postcode (remove spaces, uppercase)
    const normalizedPostcode = query.replace(/\s+/g, '').toUpperCase();

    // First, try to find an exact match
    const exactMatch = mps.find(mp => 
      mp.postcodes?.some(p => p.replace(/\s+/g, '').toUpperCase() === normalizedPostcode)
    );

    if (exactMatch) {
      results = [exactMatch];
    } else {
      // If no exact match, try to match just the outward code (first part of postcode)
      const outwardCode = normalizedPostcode.split(/\d/)[0]; // Extract the letter prefix

      if (outwardCode && outwardCode.length >= 1) {
        results = mps.filter(mp => 
          mp.postcodes?.some(p => p.replace(/\s+/g, '').toUpperCase().startsWith(outwardCode))
        );
      } else {
        results = [];
      }
    }
  } else {
    // General search across all fields
    results = mps.filter(mp => {
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
router.get('/postcode/:postcode', (req, res) => {
  const postcode = req.params.postcode.toUpperCase().trim();

  if (!postcode) {
    return res.status(400).json({ error: 'Postcode parameter is required' });
  }

  const cacheKey = `mp_postcode_${postcode}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  const mps = getMPs();

  // Normalize the postcode (remove spaces, uppercase)
  const normalizedPostcode = postcode.replace(/\s+/g, '');

  // First, try to find an exact match
  const exactMatch = mps.find(mp => 
    mp.postcodes?.some(p => p.replace(/\s+/g, '').toUpperCase() === normalizedPostcode)
  );

  if (exactMatch) {
    cache.set(cacheKey, exactMatch);
    return res.json(exactMatch);
  }

  // If no exact match, try to match just the outward code (first part of postcode)
  const outwardCode = normalizedPostcode.split(/\d/)[0]; // Extract the letter prefix

  if (outwardCode && outwardCode.length >= 1) {
    const match = mps.find(mp => 
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
router.get('/constituency/:name', (req, res) => {
  const constituencyName = req.params.name.toLowerCase().trim();

  if (!constituencyName) {
    return res.status(400).json({ error: 'Constituency name parameter is required' });
  }

  const cacheKey = `mp_constituency_${constituencyName}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  const mps = getMPs();
  const results = mps.filter(mp => mp.constituency.toLowerCase().includes(constituencyName));

  cache.set(cacheKey, results);
  res.json(results);
});

// Find MPs by party
router.get('/party/:name', (req, res) => {
  const partyName = req.params.name.toLowerCase().trim();

  if (!partyName) {
    return res.status(400).json({ error: 'Party name parameter is required' });
  }

  const cacheKey = `mp_party_${partyName}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  const mps = getMPs();
  const results = mps.filter(mp => 
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
      let filteredMPs = mockMPs;

      if (q) {
        const query = (q as string).toLowerCase();
        filteredMPs = filteredMPs.filter(mp =>
          mp.name.toLowerCase().includes(query) ||
          mp.constituency.toLowerCase().includes(query) ||
          mp.party.toLowerCase().includes(query) ||
          mp.postcode.toLowerCase().includes(query) ||
          mp.fullPostcodes.some(pc => pc.toLowerCase().includes(query))
        );
      }

      if (postcode) {
        const pc = (postcode as string).toLowerCase();
        filteredMPs = filteredMPs.filter(mp =>
          mp.postcode.toLowerCase().includes(pc) ||
          mp.fullPostcodes.some(fpc => fpc.toLowerCase().includes(pc))
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
          mp.party.toLowerCase().includes(party_query)
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
      mp = mockMPs.find(mp => mp.id === id);
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
