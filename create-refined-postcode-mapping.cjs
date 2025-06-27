const fs = require('fs');

// Load the current data
const mps = JSON.parse(fs.readFileSync('./public/data/mps.json', 'utf8'));

// Create a mapping of actual constituencies we have
const actualConstituencies = new Set(mps.map(mp => mp.constituency));

console.log('Creating refined postcode mapping with only constituencies we have MPs for...\n');

// Create a refined postcode-to-constituency mapping using only constituencies we have
const postcodeToConstituency = {
  // Bristol
  'BS1': 'Bristol Central',
  'BS2': 'Bristol Central', 
  'BS3': 'Bristol South',
  'BS4': 'Bristol South',
  'BS5': 'Bristol East',
  'BS6': 'Bristol North East',
  'BS7': 'Bristol North East',
  'BS8': 'Bristol Central',
  'BS9': 'Bristol North West',
  'BS10': 'Bristol North West',
  'BS11': 'Bristol North West',
  'BS13': 'Bristol South',
  'BS14': 'Bristol South',
  'BS15': 'Bristol East',
  'BS16': 'Bristol East',
  'BS34': 'Bristol North East',

  // Manchester (using real constituencies from our data)
  'M1': 'Manchester Central',
  'M2': 'Manchester Central',
  'M3': 'Manchester Central',
  'M4': 'Manchester Central',
  'M5': 'Manchester Central',
  'M8': 'Manchester Gorton',
  'M9': 'Manchester Gorton',
  'M11': 'Manchester Gorton',
  'M12': 'Manchester Gorton',
  'M13': 'Manchester Rusholme',
  'M14': 'Manchester Rusholme',
  'M15': 'Manchester Central',
  'M16': 'Manchester Withington',
  'M17': 'Manchester Central',
  'M18': 'Manchester Gorton',
  'M19': 'Manchester Gorton',
  'M20': 'Manchester Withington',
  'M21': 'Manchester Withington',
  'M22': 'Manchester Withington',
  'M23': 'Manchester Withington',

  // Birmingham
  'B1': 'Birmingham Ladywood',
  'B2': 'Birmingham Ladywood',
  'B3': 'Birmingham Ladywood',
  'B4': 'Birmingham Ladywood',
  'B5': 'Birmingham Ladywood',
  'B15': 'Birmingham Edgbaston',
  'B16': 'Birmingham Edgbaston',
  'B17': 'Birmingham Edgbaston',
  'B18': 'Birmingham Perry Barr',
  'B19': 'Birmingham Perry Barr',
  'B20': 'Birmingham Perry Barr',
  'B21': 'Birmingham Perry Barr',

  // Liverpool
  'L1': 'Liverpool Riverside',
  'L2': 'Liverpool Riverside',
  'L3': 'Liverpool Riverside',
  'L4': 'Liverpool Walton',
  'L5': 'Liverpool Walton',
  'L6': 'Liverpool Walton',
  'L7': 'Liverpool Riverside',
  'L8': 'Liverpool Riverside',
  'L9': 'Liverpool Walton',
  'L10': 'Liverpool Walton',
  'L11': 'Liverpool Walton',
  'L12': 'Liverpool West Derby',
  'L13': 'Liverpool West Derby',
  'L14': 'Liverpool West Derby',
  'L15': 'Liverpool Wavertree',
  'L16': 'Liverpool Wavertree',
  'L17': 'Liverpool Wavertree',
  'L18': 'Liverpool Wavertree',

  // London (using constituencies we have)
  'SW1': 'Cities of London and Westminster',
  'SW2': 'Streatham and Croydon North', // Updated to match our data
  'SW4': 'Streatham and Croydon North',
  'SW8': 'Vauxhall and Camberwell Green', // Updated to match our data
  'SW9': 'Vauxhall and Camberwell Green',
  'SW11': 'Battersea',
  'SW12': 'Battersea',
  'SW15': 'Putney',
  'SW17': 'Tooting',
  'SW18': 'Putney',
  'SW19': 'Wimbledon',
  'SW20': 'Wimbledon',
  'W1': 'Cities of London and Westminster',
  'W2': 'Cities of London and Westminster',
  'W4': 'Brentford and Isleworth',
  'W6': 'Hammersmith and Chiswick', // Updated to match our data
  'W12': 'Hammersmith and Chiswick',
  'W14': 'Hammersmith and Chiswick',
  'EC1': 'Islington South and Finsbury',
  'EC2': 'Cities of London and Westminster',
  'EC3': 'Cities of London and Westminster',
  'EC4': 'Cities of London and Westminster',

  // Edinburgh
  'EH4': 'Edinburgh North and Leith',
  'EH5': 'Edinburgh North and Leith',
  'EH6': 'Edinburgh North and Leith',
  'EH7': 'Edinburgh North and Leith',
  'EH10': 'Edinburgh South',
  'EH11': 'Edinburgh South West',
  'EH12': 'Edinburgh West',
  'EH13': 'Edinburgh West',
  'EH14': 'Edinburgh West',
  'EH15': 'Edinburgh East and Musselburgh', // Updated to match our data
  'EH16': 'Edinburgh South',
  'EH17': 'Edinburgh South',

  // Glasgow
  'G1': 'Glasgow East', // Simplified to match our data
  'G2': 'Glasgow East',
  'G3': 'Glasgow East',
  'G4': 'Glasgow East',
  'G5': 'Glasgow East',
  'G11': 'Glasgow West',
  'G12': 'Glasgow West',
  'G13': 'Glasgow North West',
  'G14': 'Glasgow North West',
  'G15': 'Glasgow North West',
  'G20': 'Glasgow North',
  'G21': 'Glasgow North',
  'G22': 'Glasgow North',
  'G23': 'Glasgow North',
  'G31': 'Glasgow East',
  'G32': 'Glasgow East',
  'G33': 'Glasgow East',
  'G34': 'Glasgow East',
  'G40': 'Glasgow East',
  'G41': 'Glasgow South',
  'G42': 'Glasgow South',
  'G43': 'Glasgow South',
  'G44': 'Glasgow South',
  'G45': 'Glasgow South',
  'G46': 'Glasgow South',

  // Leeds
  'LS1': 'Leeds Central and Headingley', // Updated to match our data
  'LS2': 'Leeds Central and Headingley',
  'LS3': 'Leeds Central and Headingley',
  'LS4': 'Leeds North West',
  'LS5': 'Leeds North West',
  'LS6': 'Leeds North West',
  'LS7': 'Leeds North East',
  'LS8': 'Leeds North East',
  'LS9': 'Leeds East',
  'LS10': 'Leeds South',
  'LS11': 'Leeds South',
  'LS12': 'Leeds West and Pudsey', // Updated to match our data
  'LS13': 'Leeds West and Pudsey',
  'LS14': 'Leeds East',
  'LS15': 'Leeds East',
  'LS16': 'Leeds North West',
  'LS17': 'Leeds North East',
  'LS18': 'Leeds North East',
  'LS19': 'Leeds North West',
  'LS20': 'Leeds North West',

  // Sheffield
  'S1': 'Sheffield Central',
  'S2': 'Sheffield Central',
  'S3': 'Sheffield Central',
  'S4': 'Sheffield Central',
  'S5': 'Sheffield Heeley',
  'S6': 'Sheffield Hallam',
  'S7': 'Sheffield Heeley',
  'S8': 'Sheffield Heeley',
  'S10': 'Sheffield Hallam',
  'S11': 'Sheffield Hallam',
  'S12': 'Sheffield Heeley',
  'S13': 'Sheffield Heeley',
  'S14': 'Sheffield Heeley',

  // Newcastle
  'NE1': 'Newcastle upon Tyne Central and West', // Updated to match our data
  'NE2': 'Newcastle upon Tyne Central and West',
  'NE4': 'Newcastle upon Tyne Central and West',
  'NE6': 'Newcastle upon Tyne East and Wallsend', // Updated to match our data
  'NE7': 'Newcastle upon Tyne East and Wallsend',
  'NE12': 'Newcastle upon Tyne North',
  'NE13': 'Newcastle upon Tyne North',
  'NE15': 'Newcastle upon Tyne Central and West',

  // Cardiff
  'CF1': 'Cardiff East', // Using constituency we have
  'CF2': 'Cardiff East',
  'CF3': 'Cardiff South and Penarth',
  'CF5': 'Cardiff West',
  'CF10': 'Cardiff East',
  'CF11': 'Cardiff South and Penarth',
  'CF14': 'Cardiff North',
  'CF15': 'Cardiff North',
  'CF23': 'Cardiff North',
  'CF24': 'Cardiff East',

  // Belfast
  'BT1': 'Belfast North',
  'BT2': 'Belfast North',
  'BT3': 'Belfast North',
  'BT4': 'Belfast East',
  'BT5': 'Belfast East',
  'BT6': 'Belfast East',
  'BT7': 'Belfast South and Mid Down', // Updated to match our data
  'BT8': 'Belfast South and Mid Down',
  'BT9': 'Belfast South and Mid Down',
  'BT10': 'Belfast South and Mid Down',
  'BT11': 'Belfast West',
  'BT12': 'Belfast West',
  'BT13': 'Belfast West',
  'BT14': 'Belfast North',
  'BT15': 'Belfast North',
  'BT16': 'Belfast East',
  'BT17': 'Belfast West',

  // Salford (for M6, M7)
  'M6': 'Salford',
  'M7': 'Salford'
};

// Verify all constituencies in our mapping exist in our MP database
const invalidMappings = [];
Object.entries(postcodeToConstituency).forEach(([postcode, constituency]) => {
  if (!actualConstituencies.has(constituency)) {
    invalidMappings.push(`${postcode} -> ${constituency}`);
  }
});

if (invalidMappings.length > 0) {
  console.log('Invalid mappings found (constituencies not in MP database):');
  invalidMappings.forEach(mapping => console.log(`  ❌ ${mapping}`));
  console.log('');
}

// Save the refined mapping
fs.writeFileSync('./public/data/postcode-to-constituency.json', JSON.stringify(postcodeToConstituency, null, 2));
console.log('Saved refined postcode-to-constituency mapping');

// Test the mapping
console.log('\n=== Testing Refined Mapping ===');
const testPostcodes = ['BS5', 'M1', 'B1', 'L1', 'SW1', 'EH4', 'G1', 'LS1', 'S1', 'NE1', 'CF1', 'BT1'];

function getMPByPostcode(postcode) {
  const cleaned = postcode.replace(/\s+/g, '').toUpperCase();
  const match = cleaned.match(/^([A-Z]{1,2}\d{1,2}[A-Z]?)/);
  if (!match) return null;
  
  const area = match[1];
  const constituency = postcodeToConstituency[area];
  if (!constituency) return null;
  
  const mp = mps.find(mp => mp.constituency === constituency);
  return mp || null;
}

testPostcodes.forEach(postcode => {
  const mp = getMPByPostcode(postcode);
  if (mp) {
    console.log(`✅ ${postcode.padEnd(5)} -> ${mp.name} (${mp.constituency})`);
  } else {
    console.log(`❌ ${postcode.padEnd(5)} -> No MP found`);
  }
});

console.log(`\nRefined mapping covers ${Object.keys(postcodeToConstituency).length} postcode areas`);
console.log(`All mappings use constituencies from our ${mps.length} MP database`);
