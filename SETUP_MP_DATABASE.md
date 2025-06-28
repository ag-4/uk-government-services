# MP Database Setup and Maintenance

This document provides instructions for setting up, updating, and maintaining the MP database used by the UK Government Services Portal.

## Overview

The application uses a database of UK Members of Parliament that includes:

- Personal information (name, constituency, party)
- Contact details (email, phone, addresses)
- Constituency mapping data (postcodes in each constituency)

This data is stored in JSON format and can be accessed by both the frontend and backend services.

## Setup Instructions

### Initial Setup

1. Make sure you have all dependencies installed:

```bash
npm install
```

2. Update the MP database with the latest data from the UK Parliament website:

```bash
npm run update-mps
```

This script will:
- Fetch current MPs from the official Parliament API
- Generate realistic postcode mappings for each constituency
- Save the data to `public/data/mps.json`

3. Verify the MP database:

```bash
npm run verify-mps
```

This script will check:
- Data completeness (constituency, party, contact info)
- Postcode coverage
- Search functionality

## Updating the Database

To update the MP database with the latest information:

```bash
npm run update-mps
```

This should be done periodically to ensure the data remains current, especially after elections or cabinet reshuffles.

## Database Structure

Each MP record contains:

```typescript
interface MP {
  id: string;              // Unique identifier (e.g., "mp-1234")
  parliamentId: number;     // Official Parliament ID
  name: string;            // Sortable name (e.g., "Smith, John")
  displayName: string;     // Display name (e.g., "John Smith")
  fullTitle: string;       // Full title with honorifics
  constituency: string;    // Constituency name
  constituencyId: number;  // Constituency ID
  party: string;           // Political party
  partyAbbreviation: string; // Party abbreviation (e.g., "Lab")
  partyColor: string;      // Party brand color
  gender: string;          // Gender
  membershipStartDate: string; // When they became an MP
  isActive: boolean;       // Whether currently serving
  email?: string;          // Email address
  phone?: string;          // Phone number
  website?: string;        // Website URL
  addresses: Array<{       // Office addresses
    type: string;
    fullAddress: string;
    postcode?: string;
  }>;
  thumbnailUrl: string;    // Profile image URL
  postcodes: string[];     // Postcodes in their constituency
  constituencyPostcodes: string[]; // Alternative postcodes list
}
```

## Troubleshooting

If you encounter issues with the MP database:

1. Check network connectivity to the Parliament API
2. Ensure the `public/data` directory exists and is writable
3. Verify that the data format matches the expected structure
4. If search results are incorrect, run the verification script to identify issues

## Custom Postcode Mapping

The application generates realistic postcode mappings for each constituency based on geographic regions. If you need to customize these mappings:

1. Edit the `postcodeMappings` and `constituencyRegions` objects in `scripts/update-mp-database.ts`
2. Run the update script to regenerate the database

## Additional Resources

- [UK Parliament Members API](https://members-api.parliament.uk/index.html)
- [UK Postcode Format Reference](https://en.wikipedia.org/wiki/Postcodes_in_the_United_Kingdom)
- [Parliamentary Constituencies](https://www.parliament.uk/about/how/elections-and-voting/constituencies/)
