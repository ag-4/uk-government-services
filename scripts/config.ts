/**
 * Configuration for UK Government Database Generation
 */

export const CONFIG = {
  // API Endpoints
  apis: {
    parliament: {
      baseUrl: 'https://members-api.parliament.uk/api',
      endpoints: {
        members: '/Members',
        constituencies: '/Constituencies',
        memberContact: '/Members/{id}/Contact',
        memberExperience: '/Members/{id}/Experience',
        memberBiography: '/Members/{id}/Biography'
      }
    },
    postcodes: {
      baseUrl: 'https://api.postcodes.io',
      endpoints: {
        lookup: '/postcodes/{postcode}',
        bulk: '/postcodes',
        validate: '/postcodes/{postcode}/validate',
        nearest: '/postcodes/{postcode}/nearest',
        autocomplete: '/postcodes/{postcode}/autocomplete'
      }
    },
    findMP: {
      baseUrl: 'https://members.parliament.uk',
      endpoints: {
        findYourMP: '/FindYourMP'
      }
    }
  },

  // Rate limiting
  rateLimiting: {
    parliamentAPI: {
      requestsPerSecond: 2,
      delayMs: 500,
      maxConcurrency: 3
    },
    postcodesAPI: {
      requestsPerSecond: 10,
      delayMs: 100,
      maxConcurrency: 5
    }
  },

  // Batch processing
  batchSizes: {
    mpFetch: 20,
    postcodeFetch: 100,
    postcodeValidation: 50
  },

  // Retry logic
  retries: {
    maxAttempts: 3,
    backoffMs: 1000,
    exponentialBackoff: true
  },

  // Output configuration
  output: {
    directory: './data/uk-government-complete',
    formats: ['json', 'csv', 'sqlite'],
    compression: true,
    validation: true
  },

  // Logging
  logging: {
    level: 'info', // debug, info, warn, error
    logToFile: true,
    logDirectory: './logs'
  }
};

export const POSTCODE_PATTERNS = {
  // UK postcode validation patterns
  fullPostcode: /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i,
  outcode: /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?$/i,
  incode: /^[0-9][A-Z]{2}$/i,
  
  // Area codes for systematic generation
  areaCodes: [
    'AB', 'AL', 'B', 'BA', 'BB', 'BD', 'BH', 'BL', 'BN', 'BR', 'BS', 'BT',
    'CA', 'CB', 'CF', 'CH', 'CM', 'CO', 'CR', 'CT', 'CV', 'CW',
    'DA', 'DD', 'DE', 'DG', 'DH', 'DL', 'DN', 'DT', 'DY',
    'E', 'EC', 'EH', 'EN', 'EX',
    'FK', 'FY',
    'G', 'GL', 'GU',
    'HA', 'HD', 'HG', 'HP', 'HR', 'HS', 'HU', 'HX',
    'IG', 'IP', 'IV',
    'KA', 'KT', 'KW', 'KY',
    'L', 'LA', 'LD', 'LE', 'LL', 'LN', 'LS', 'LU',
    'M', 'ME', 'MK', 'ML',
    'N', 'NE', 'NG', 'NN', 'NP', 'NR', 'NW',
    'OL', 'OX',
    'PA', 'PE', 'PH', 'PL', 'PO', 'PR',
    'RG', 'RH', 'RM', 'S', 'SA', 'SE', 'SG', 'SK', 'SL', 'SM', 'SN', 'SO', 'SP', 'SR', 'SS', 'ST', 'SW', 'SY',
    'TA', 'TD', 'TF', 'TN', 'TQ', 'TR', 'TS', 'TW',
    'UB',
    'W', 'WA', 'WC', 'WD', 'WF', 'WN', 'WR', 'WS', 'WV',
    'YO',
    'ZE'
  ]
};

export const EXPECTED_TOTALS = {
  mps: 650,
  constituencies: 650,
  postcodes: 1800000, // Approximately 1.8 million
  postcodeOutcodes: 2900, // Approximately 2,900 outcodes
  postcodeIncodes: 9999 // Maximum possible incodes per outcode
};
