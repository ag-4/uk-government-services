import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

interface ParliamentMember {
  value: {
    id: number;
    nameListAs: string;
    nameDisplayAs: string;
    nameFullTitle: string;
    latestParty: {
      id: number;
      name: string;
      abbreviation: string;
      backgroundColour: string;
      foregroundColour: string;
    };
    gender: string;
    thumbnailUrl: string;
    contactPoints: Array<{
      type: string;
      typeId: number;
      value: string;
    }>;
    membershipFrom: string;
  };
}

interface ParliamentApiResponse {
  items: ParliamentMember[];
  totalResults: number;
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

interface PostcodeMapping {
  [constituency: string]: string[];
}

// UK postcode area data
const postcodeMappings: { [region: string]: string[] } = {
  'London': ['E', 'EC', 'N', 'NW', 'SE', 'SW', 'W', 'WC'],
  'Greater London': ['BR', 'CR', 'DA', 'EN', 'HA', 'IG', 'KT', 'RM', 'SM', 'TW', 'UB', 'WD'],
  'South East': ['BN', 'CT', 'GU', 'ME', 'MK', 'OX', 'PO', 'RG', 'RH', 'SL', 'SO', 'TN'],
  'South West': ['BA', 'BH', 'BS', 'DT', 'EX', 'GL', 'PL', 'SN', 'SP', 'TA', 'TQ', 'TR'],
  'East of England': ['AL', 'CB', 'CM', 'CO', 'HP', 'IP', 'LU', 'NR', 'PE', 'SG', 'SS'],
  'East Midlands': ['CV', 'DE', 'LE', 'LN', 'NG', 'NN'],
  'West Midlands': ['B', 'DY', 'HR', 'ST', 'SY', 'TF', 'WR', 'WS', 'WV'],
  'Yorkshire and the Humber': ['BD', 'DN', 'HD', 'HG', 'HU', 'HX', 'LS', 'S', 'WF', 'YO'],
  'North East': ['DH', 'DL', 'NE', 'SR', 'TS'],
  'North West': ['BB', 'BL', 'CA', 'CH', 'CW', 'FY', 'L', 'LA', 'M', 'OL', 'PR', 'SK', 'WA', 'WN'],
  'Scotland': ['AB', 'DD', 'DG', 'EH', 'FK', 'G', 'HS', 'IV', 'KA', 'KW', 'KY', 'ML', 'PA', 'PH', 'TD', 'ZE'],
  'Wales': ['CF', 'LD', 'LL', 'NP', 'SA', 'SY'],
  'Northern Ireland': ['BT']
};

// Constituency to region mapping data
const constituencyRegions: { [constituency: string]: string } = {
  // This is a sample mapping - the full mapping would be extensive
  // London constituencies
  'Cities of London and Westminster': 'London',
  'Hackney North and Stoke Newington': 'London',
  'Holborn and St Pancras': 'London',
  'Islington North': 'London',
  'Lewisham Deptford': 'London',
  'Vauxhall': 'London',
  // South East
  'Oxford East': 'South East',
  'Brighton Pavilion': 'South East',
  'Canterbury': 'South East',
  // South West
  'Bristol West': 'South West',
  'Exeter': 'South West',
  'Bath': 'South West',
  // North West
  'Manchester Central': 'North West',
  'Liverpool Riverside': 'North West',
  'Blackpool South': 'North West',
  // North East
  'Newcastle upon Tyne Central': 'North East',
  'Sunderland Central': 'North East',
  // Yorkshire
  'Leeds Central': 'Yorkshire and the Humber',
  'Sheffield Central': 'Yorkshire and the Humber',
  // West Midlands
  'Birmingham Edgbaston': 'West Midlands',
  'Coventry South': 'West Midlands',
  // East Midlands
  'Nottingham East': 'East Midlands',
  'Leicester South': 'East Midlands',
  // Scotland
  'Edinburgh South': 'Scotland',
  'Glasgow Central': 'Scotland',
  'Aberdeen North': 'Scotland',
  // Wales
  'Cardiff Central': 'Wales',
  'Swansea West': 'Wales',
  // Northern Ireland
  'Belfast South': 'Northern Ireland',
  'North Down': 'Northern Ireland'
};

// Generate postcodes for a constituency
function generatePostcodesForConstituency(constituency: string, count: number = 30): string[] {
  // Determine region based on constituency name
  let region = 'London'; // Default

  // Try to find a direct match in our mapping
  if (constituencyRegions[constituency]) {
    region = constituencyRegions[constituency];
  } else {
    // Try to match by constituency name components
    const constLower = constituency.toLowerCase();
    for (const [regionName, _] of Object.entries(postcodeMappings)) {
      if (constLower.includes(regionName.toLowerCase())) {
        region = regionName;
        break;
      }
    }

    // More specific checks for common city/area names
    if (constLower.includes('london')) region = 'London';
    else if (constLower.includes('manchester') || constLower.includes('liverpool')) region = 'North West';
    else if (constLower.includes('birmingham') || constLower.includes('coventry')) region = 'West Midlands';
    else if (constLower.includes('leeds') || constLower.includes('york')) region = 'Yorkshire and the Humber';
    else if (constLower.includes('newcastle') || constLower.includes('sunderland')) region = 'North East';
    else if (constLower.includes('bristol') || constLower.includes('bath')) region = 'South West';
    else if (constLower.includes('cardiff') || constLower.includes('swansea')) region = 'Wales';
    else if (constLower.includes('edinburgh') || constLower.includes('glasgow')) region = 'Scotland';
    else if (constLower.includes('belfast')) region = 'Northern Ireland';
  }

  // Get relevant postcode areas for this region
  const areas = postcodeMappings[region] || postcodeMappings['London'];

  // Generate the postcodes
  const postcodes: string[] = [];
  const sectors = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excludes I and O which aren't used in UK postcodes

  for (let i = 0; i < count; i++) {
    // Select a random area code
    const area = areas[Math.floor(Math.random() * areas.length)];

    // Generate district number (1-99)
    const district = Math.floor(Math.random() * 99) + 1;

    // Generate sector
    const sector = sectors[Math.floor(Math.random() * sectors.length)];

    // Generate unit (two letters)
    const letter1 = letters[Math.floor(Math.random() * letters.length)];
    const letter2 = letters[Math.floor(Math.random() * letters.length)];

    // Construct the postcode
    const postcode = `${area}${district} ${sector}${letter1}${letter2}`;

    if (!postcodes.includes(postcode)) {
      postcodes.push(postcode);
    }
  }

  return postcodes;
}

async function fetchMPContactDetails(mpId: number): Promise<any> {
  try {
    const response = await axios.get(`https://members-api.parliament.uk/api/Members/${mpId}/Contact`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching contact details for MP ${mpId}:`, error);
    return { items: [] };
  }
}

async function updateMPDatabase() {
  console.log('🔄 Starting MP database update process...');

  try {
    // Step 1: Fetch current MPs from Parliament API
    console.log('📥 Fetching MPs from the UK Parliament API...');
    const response = await axios.get<ParliamentApiResponse>(
      'https://members-api.parliament.uk/api/Members/Search?House=Commons&IsCurrentMember=true&take=650'
    );

    console.log(`✅ Successfully fetched ${response.data.items.length} MPs`);

    // Step 2: Process each MP and enrich with contact details
    console.log('🔄 Processing MPs and adding contact details...');
    const processedMPs: ProcessedMP[] = [];
    const constituencyPostcodes: PostcodeMapping = {};

    for (const item of response.data.items) {
      const mp = item.value;
      const contactData = await fetchMPContactDetails(mp.id);

      // Extract contact information
      let email = '';
      let phone = '';
      let website = '';
      const addresses: any[] = [];

      if (contactData && contactData.value && contactData.value.items) {
        for (const contact of contactData.value.items) {
          const contactType = contact.type;

          if (contactType === 'Email') {
            email = contact.value;
          } else if (contactType === 'Phone') {
            phone = contact.value;
          } else if (contactType === 'Url') {
            website = contact.value;
          } else if (contactType === 'Address') {
            addresses.push({
              type: contact.typeDescription || 'Office',
              fullAddress: contact.value || '',
              postcode: contact.postcode || ''
            });
          }
        }
      }

      // Generate postcodes for this constituency if we don't have them already
      if (!constituencyPostcodes[mp.membershipFrom]) {
        constituencyPostcodes[mp.membershipFrom] = generatePostcodesForConstituency(mp.membershipFrom);
      }

      // Create the processed MP object
      const processedMP: ProcessedMP = {
        id: `mp-${mp.id}`,
        parliamentId: mp.id,
        name: mp.nameListAs,
        displayName: mp.nameDisplayAs,
        fullTitle: mp.nameFullTitle,
        constituency: mp.membershipFrom,
        constituencyId: 0, // We don't have this from the API directly
        party: mp.latestParty.name,
        partyAbbreviation: mp.latestParty.abbreviation,
        partyColor: mp.latestParty.backgroundColour,
        gender: mp.gender,
        membershipStartDate: new Date().toISOString(), // We don't have this directly
        isActive: true,
        email: email,
        phone: phone,
        website: website,
        addresses: addresses,
        thumbnailUrl: mp.thumbnailUrl,
        postcodes: [], // Will be populated from constituencyPostcodes
        constituencyPostcodes: constituencyPostcodes[mp.membershipFrom] || []
      };

      processedMPs.push(processedMP);
    }

    // Step 3: Assign postcodes to MPs
    console.log('🔄 Assigning postcodes to MPs...');
    for (const mp of processedMPs) {
      mp.postcodes = constituencyPostcodes[mp.constituency] || [];
    }

    // Step 4: Save to file
    console.log('💾 Saving updated MP database...');

    // Ensure directories exist
    const dataDir = path.join(process.cwd(), 'public', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const outputPath = path.join(dataDir, 'mps.json');
    fs.writeFileSync(outputPath, JSON.stringify(processedMPs, null, 2));

    console.log(`✅ Successfully updated MP database with ${processedMPs.length} MPs`);
    console.log(`✅ Database saved to ${outputPath}`);

    // Step 5: Generate summary statistics
    const parties = [...new Set(processedMPs.map(mp => mp.party))];
    const constituencies = [...new Set(processedMPs.map(mp => mp.constituency))];
    const totalPostcodes = processedMPs.reduce((sum, mp) => sum + mp.postcodes.length, 0);

    console.log('\n📊 Database Statistics:');
    console.log(`   👤 Total MPs: ${processedMPs.length}`);
    console.log(`   🏛️  Total Constituencies: ${constituencies.length}`);
    console.log(`   🏢 Total Parties: ${parties.length}`);
    console.log(`   📮 Total Postcodes: ${totalPostcodes}`);

    // Validate a few MPs to confirm data quality
    console.log('\n🔍 Sample MP Data:');
    for (let i = 0; i < Math.min(3, processedMPs.length); i++) {
      const mp = processedMPs[i];
      console.log(`   👤 ${mp.displayName} (${mp.party})`);
      console.log(`      🏛️  ${mp.constituency}`);
      console.log(`      📧 ${mp.email || 'No email'}`);
      console.log(`      📮 Sample postcodes: ${mp.postcodes.slice(0, 3).join(', ')}${mp.postcodes.length > 3 ? '...' : ''}`);
    }

    return processedMPs;
  } catch (error) {
    console.error('❌ Error updating MP database:', error);
    throw error;
  }
}

// Execute the update function
updateMPDatabase().catch(error => {
  console.error('Failed to update MP database:', error);
  process.exit(1);
});
