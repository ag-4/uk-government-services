import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// UK Parliament API endpoints
const PARLIAMENT_API_BASE = 'https://members-api.parliament.uk/api';

interface RealMPData {
  id: string;
  parliamentId: number;
  name: string;
  displayName: string;
  fullTitle?: string;
  constituency: string;
  constituencyId: number;
  party: string;
  partyAbbreviation: string;
  partyColor: string;
  gender: string;
  membershipStartDate: string;
  membershipEndDate: string | null;
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
  biography: string;
  thumbnailUrl: string;
  postcodes: string[];
  constituencyPostcodes: string[];
  committees: string[];
  experience: any[];
  socialMedia: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    website?: string;
  };
}

async function fetchRealMPData(): Promise<RealMPData[]> {
  try {
    console.log('Fetching current MPs from UK Parliament API...');
    
    // Get current MPs
    const membersResponse = await fetch(`${PARLIAMENT_API_BASE}/Members/Search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        house: 1, // House of Commons
        isEligible: true,
        skip: 0,
        take: 650
      })
    });

    if (!membersResponse.ok) {
      throw new Error(`Parliament API error: ${membersResponse.status}`);
    }

    const membersData = await membersResponse.json();
    const members = membersData.items || [];

    console.log(`Found ${members.length} MPs from Parliament API`);

    const realMPData: RealMPData[] = [];

    for (const member of members.slice(0, 50)) { // Start with first 50 for testing
      try {
        console.log(`Processing ${member.nameDisplayAs}...`);

        // Get detailed member info
        const detailResponse = await fetch(`${PARLIAMENT_API_BASE}/Members/${member.id}`);
        const memberDetail = await detailResponse.json();

        // Get constituency info
        let constituencyName = memberDetail.latestHouseMembership?.membershipFrom || 'Unknown';
        
        // Get contact details
        const contactResponse = await fetch(`${PARLIAMENT_API_BASE}/Members/${member.id}/Contact`);
        const contactData = await contactResponse.json();

        // Get addresses
        const addressResponse = await fetch(`${PARLIAMENT_API_BASE}/Members/${member.id}/Addresses`);
        const addressData = await addressResponse.json();

        const mp: RealMPData = {
          id: `MP${member.id}`,
          parliamentId: member.id,
          name: member.nameFullTitle || member.nameDisplayAs,
          displayName: member.nameDisplayAs,
          fullTitle: member.nameFullTitle,
          constituency: constituencyName,
          constituencyId: memberDetail.latestHouseMembership?.membershipFromId || 0,
          party: memberDetail.latestParty?.name || 'Independent',
          partyAbbreviation: memberDetail.latestParty?.abbreviation || 'Ind',
          partyColor: getPartyColor(memberDetail.latestParty?.name || 'Independent'),
          gender: memberDetail.gender || 'U',
          membershipStartDate: memberDetail.latestHouseMembership?.membershipStartDate || new Date().toISOString(),
          membershipEndDate: memberDetail.latestHouseMembership?.membershipEndDate || null,
          isActive: memberDetail.latestHouseMembership?.membershipStatus?.statusIsActive || true,
          email: extractEmail(contactData),
          phone: extractPhone(contactData),
          website: extractWebsite(contactData),
          addresses: processAddresses(addressData),
          biography: memberDetail.synopsis || '',
          thumbnailUrl: `https://members-api.parliament.uk/api/Members/${member.id}/Thumbnail`,
          postcodes: [], // We'll need to map these separately
          constituencyPostcodes: [], // We'll need to map these separately
          committees: [],
          experience: [],
          socialMedia: extractSocialMedia(contactData)
        };

        realMPData.push(mp);

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Error processing ${member.nameDisplayAs}:`, error);
      }
    }

    return realMPData;

  } catch (error) {
    console.error('Error fetching real MP data:', error);
    throw error;
  }
}

function getPartyColor(partyName: string): string {
  const partyColors: { [key: string]: string } = {
    'Labour': 'e4003b',
    'Conservative': '0087dc',
    'Liberal Democrat': 'faa61a',
    'Scottish National Party': 'fff95d',
    'Green Party': '6ab023',
    'Reform UK': '12b6cf',
    'Plaid Cymru': '005b54',
    'Democratic Unionist Party': 'd46a4c',
    'Sinn Féin': '326760',
    'Alliance': 'f6cb2f',
    'Independent': '909090'
  };
  
  return partyColors[partyName] || '909090';
}

function extractEmail(contactData: any): string {
  if (!contactData || !contactData.length) return '';
  
  for (const contact of contactData) {
    if (contact.type === 'Parliamentary' && contact.email) {
      return contact.email;
    }
  }
  
  // Fallback to any email
  for (const contact of contactData) {
    if (contact.email) {
      return contact.email;
    }
  }
  
  return '';
}

function extractPhone(contactData: any): string {
  if (!contactData || !contactData.length) return '';
  
  for (const contact of contactData) {
    if (contact.type === 'Parliamentary' && contact.phone) {
      return contact.phone;
    }
  }
  
  // Fallback to any phone
  for (const contact of contactData) {
    if (contact.phone) {
      return contact.phone;
    }
  }
  
  return '';
}

function extractWebsite(contactData: any): string {
  if (!contactData || !contactData.length) return '';
  
  for (const contact of contactData) {
    if (contact.website) {
      return contact.website;
    }
  }
  
  return '';
}

function processAddresses(addressData: any): any[] {
  if (!addressData || !addressData.length) return [];
  
  return addressData.map((addr: any) => ({
    type: addr.type || 'Office',
    fullAddress: [addr.line1, addr.line2, addr.town, addr.county, addr.postcode]
      .filter(Boolean)
      .join(', '),
    postcode: addr.postcode,
    line1: addr.line1,
    line2: addr.line2,
    town: addr.town,
    county: addr.county,
    country: addr.country || 'UK'
  }));
}

function extractSocialMedia(contactData: any): any {
  const social: any = {};
  
  if (!contactData || !contactData.length) return social;
  
  for (const contact of contactData) {
    if (contact.twitter) social.twitter = contact.twitter;
    if (contact.facebook) social.facebook = contact.facebook;
    if (contact.instagram) social.instagram = contact.instagram;
  }
  
  return social;
}

// Main execution
async function main() {
  try {
    const realMPs = await fetchRealMPData();
    
    // Save to file
    const outputPath = path.join(process.cwd(), 'public', 'data', 'real-mps.json');
    fs.writeFileSync(outputPath, JSON.stringify(realMPs, null, 2));
    
    console.log(`Successfully saved ${realMPs.length} real MP records to ${outputPath}`);
    
    // Create backup of old file
    const oldPath = path.join(process.cwd(), 'public', 'data', 'mps.json');
    const backupPath = path.join(process.cwd(), 'public', 'data', 'mps-backup.json');
    
    if (fs.existsSync(oldPath)) {
      fs.copyFileSync(oldPath, backupPath);
      console.log('Backed up old MP data to mps-backup.json');
    }
    
    // Replace the old file
    fs.copyFileSync(outputPath, oldPath);
    console.log('Replaced mps.json with real MP data');
    
  } catch (error) {
    console.error('Failed to fetch real MP data:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { fetchRealMPData };
