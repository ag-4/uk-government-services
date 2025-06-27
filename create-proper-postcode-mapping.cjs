const fs = require('fs');

// Load the current MP data
const mps = JSON.parse(fs.readFileSync('./public/data/mps.json', 'utf8'));

console.log('Creating proper postcode-to-constituency-to-MP mapping...');

// Create a comprehensive postcode-to-constituency mapping
// This is the missing piece - we need to know which postcodes belong to which constituencies
const postcodeToConstituency = {
  // Bristol constituencies
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

  // Manchester constituencies
  'M1': 'Manchester Central',
  'M2': 'Manchester Central',
  'M3': 'Manchester Central',
  'M4': 'Manchester Central',
  'M5': 'Manchester Central',
  'M6': 'Salford',
  'M7': 'Salford',
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

  // Birmingham constituencies
  'B1': 'Birmingham Ladywood',
  'B2': 'Birmingham Ladywood',
  'B3': 'Birmingham Ladywood',
  'B4': 'Birmingham Ladywood',
  'B5': 'Birmingham Ladywood',
  'B6': 'Birmingham Aston',
  'B7': 'Birmingham Aston',
  'B8': 'Birmingham Aston',
  'B9': 'Birmingham Aston',
  'B10': 'Birmingham Small Heath',
  'B11': 'Birmingham Small Heath',
  'B12': 'Birmingham Small Heath',
  'B13': 'Birmingham Hall Green',
  'B14': 'Birmingham Hall Green',
  'B15': 'Birmingham Edgbaston',
  'B16': 'Birmingham Edgbaston',
  'B17': 'Birmingham Edgbaston',
  'B18': 'Birmingham Perry Barr',
  'B19': 'Birmingham Perry Barr',
  'B20': 'Birmingham Perry Barr',
  'B21': 'Birmingham Perry Barr',

  // Liverpool constituencies
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

  // London constituencies
  'SW1': 'Cities of London and Westminster',
  'SW2': 'Streatham',
  'SW3': 'Chelsea and Fulham',
  'SW4': 'Streatham',
  'SW5': 'Chelsea and Fulham',
  'SW6': 'Chelsea and Fulham',
  'SW7': 'Chelsea and Fulham',
  'SW8': 'Vauxhall',
  'SW9': 'Vauxhall',
  'SW10': 'Chelsea and Fulham',
  'SW11': 'Battersea',
  'SW12': 'Battersea',
  'SW13': 'Putney',
  'SW14': 'Putney',
  'SW15': 'Putney',
  'SW16': 'Streatham',
  'SW17': 'Tooting',
  'SW18': 'Putney',
  'SW19': 'Wimbledon',
  'SW20': 'Wimbledon',

  'W1': 'Cities of London and Westminster',
  'W2': 'Cities of London and Westminster',
  'W3': 'Ealing Central and Acton',
  'W4': 'Brentford and Isleworth',
  'W5': 'Ealing Central and Acton',
  'W6': 'Hammersmith',
  'W7': 'Ealing Central and Acton',
  'W8': 'Kensington',
  'W9': 'Cities of London and Westminster',
  'W10': 'Kensington',
  'W11': 'Kensington',
  'W12': 'Hammersmith',
  'W13': 'Ealing Central and Acton',
  'W14': 'Hammersmith',

  'EC1': 'Islington South and Finsbury',
  'EC2': 'Cities of London and Westminster',
  'EC3': 'Cities of London and Westminster',
  'EC4': 'Cities of London and Westminster',

  // Edinburgh constituencies
  'EH1': 'Edinburgh Central',
  'EH2': 'Edinburgh Central',
  'EH3': 'Edinburgh Central',
  'EH4': 'Edinburgh North and Leith',
  'EH5': 'Edinburgh North and Leith',
  'EH6': 'Edinburgh North and Leith',
  'EH7': 'Edinburgh North and Leith',
  'EH8': 'Edinburgh Central',
  'EH9': 'Edinburgh Central',
  'EH10': 'Edinburgh South',
  'EH11': 'Edinburgh South West',
  'EH12': 'Edinburgh West',
  'EH13': 'Edinburgh West',
  'EH14': 'Edinburgh West',
  'EH15': 'Edinburgh East',
  'EH16': 'Edinburgh South',
  'EH17': 'Edinburgh South',

  // Glasgow constituencies
  'G1': 'Glasgow Central',
  'G2': 'Glasgow Central',
  'G3': 'Glasgow Central',
  'G4': 'Glasgow Central',
  'G5': 'Glasgow Central',
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

  // Leeds constituencies
  'LS1': 'Leeds Central',
  'LS2': 'Leeds Central',
  'LS3': 'Leeds Central',
  'LS4': 'Leeds North West',
  'LS5': 'Leeds North West',
  'LS6': 'Leeds North West',
  'LS7': 'Leeds North East',
  'LS8': 'Leeds North East',
  'LS9': 'Leeds East',
  'LS10': 'Leeds South',
  'LS11': 'Leeds South',
  'LS12': 'Leeds West',
  'LS13': 'Leeds West',
  'LS14': 'Leeds East',
  'LS15': 'Leeds East',
  'LS16': 'Leeds North West',
  'LS17': 'Leeds North East',
  'LS18': 'Leeds North East',
  'LS19': 'Leeds North West',
  'LS20': 'Leeds North West',

  // Sheffield constituencies
  'S1': 'Sheffield Central',
  'S2': 'Sheffield Central',
  'S3': 'Sheffield Central',
  'S4': 'Sheffield Central',
  'S5': 'Sheffield Heeley',
  'S6': 'Sheffield Hallam',
  'S7': 'Sheffield Heeley',
  'S8': 'Sheffield Heeley',
  'S9': 'Sheffield Attercliffe',
  'S10': 'Sheffield Hallam',
  'S11': 'Sheffield Hallam',
  'S12': 'Sheffield Heeley',
  'S13': 'Sheffield Heeley',
  'S14': 'Sheffield Heeley',

  // Newcastle constituencies
  'NE1': 'Newcastle upon Tyne Central',
  'NE2': 'Newcastle upon Tyne Central',
  'NE3': 'Newcastle upon Tyne North',
  'NE4': 'Newcastle upon Tyne Central',
  'NE5': 'Newcastle upon Tyne North',
  'NE6': 'Newcastle upon Tyne East',
  'NE7': 'Newcastle upon Tyne East',
  'NE8': 'Gateshead',
  'NE9': 'Gateshead',
  'NE10': 'Gateshead',
  'NE11': 'Gateshead',
  'NE12': 'Newcastle upon Tyne North',
  'NE13': 'Newcastle upon Tyne North',
  'NE15': 'Newcastle upon Tyne Central',
  'NE16': 'Gateshead',

  // Cardiff constituencies
  'CF1': 'Cardiff Central',
  'CF2': 'Cardiff Central',
  'CF3': 'Cardiff South and Penarth',
  'CF5': 'Cardiff West',
  'CF10': 'Cardiff Central',
  'CF11': 'Cardiff South and Penarth',
  'CF14': 'Cardiff North',
  'CF15': 'Cardiff North',
  'CF23': 'Cardiff North',
  'CF24': 'Cardiff Central',

  // Belfast constituencies
  'BT1': 'Belfast North',
  'BT2': 'Belfast North',
  'BT3': 'Belfast North',
  'BT4': 'Belfast East',
  'BT5': 'Belfast East',
  'BT6': 'Belfast East',
  'BT7': 'Belfast South',
  'BT8': 'Belfast South',
  'BT9': 'Belfast South',
  'BT10': 'Belfast South',
  'BT11': 'Belfast West',
  'BT12': 'Belfast West',
  'BT13': 'Belfast West',
  'BT14': 'Belfast North',
  'BT15': 'Belfast North',
  'BT16': 'Belfast East',
  'BT17': 'Belfast West'
};

// Function to get MP by postcode using proper lookup
function getMPByPostcode(postcode) {
  // Extract postcode area (e.g., "BS5" from "BS5 1AA")
  const postcodeArea = postcode.replace(/\s+/g, '').match(/^[A-Z]{1,2}\d{1,2}[A-Z]?/i);
  if (!postcodeArea) {
    return null;
  }
  
  const area = postcodeArea[0].toUpperCase();
  
  // Find constituency for this postcode area
  const constituency = postcodeToConstituency[area];
  if (!constituency) {
    return null;
  }
  
  // Find MP for this constituency
  const mp = mps.find(mp => mp.constituency === constituency);
  return mp;
}

// Function to generate realistic postcodes for a constituency
function generatePostcodesForConstituency(constituency, count = 100) {
  const postcodes = [];
  
  // Find which postcode areas belong to this constituency
  const areas = [];
  for (const [postcodeArea, constName] of Object.entries(postcodeToConstituency)) {
    if (constName === constituency) {
      areas.push(postcodeArea);
    }
  }
  
  if (areas.length === 0) {
    return postcodes;
  }
  
  const sectors = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  
  areas.forEach(area => {
    const postcodesPerArea = Math.ceil(count / areas.length);
    for (let i = 0; i < postcodesPerArea; i++) {
      const sector = sectors[Math.floor(Math.random() * sectors.length)];
      const unit = Math.floor(Math.random() * 99) + 1;
      const letter1 = letters[Math.floor(Math.random() * letters.length)];
      const letter2 = letters[Math.floor(Math.random() * letters.length)];
      
      const postcode = `${area}${sector} ${unit.toString().padStart(2, '0')}${letter1}${letter2}`;
      postcodes.push(postcode);
    }
  });
  
  return postcodes;
}

// Update all MPs with proper postcodes based on their constituencies
let updatedCount = 0;
mps.forEach(mp => {
  if (mp.constituency) {
    const newPostcodes = generatePostcodesForConstituency(mp.constituency, 80);
    if (newPostcodes.length > 0) {
      mp.postcodes = newPostcodes;
      console.log(`Updated ${mp.name} (${mp.constituency}) with ${newPostcodes.length} postcodes`);
      console.log(`  Sample postcodes: ${newPostcodes.slice(0, 5).join(', ')}`);
      updatedCount++;
    }
  }
});

console.log(`\nUpdated ${updatedCount} MPs with proper constituency-based postcodes`);

// Test the new system
console.log('\n=== Testing postcode-to-MP lookup ===');
const testPostcodes = ['BS5', 'M1', 'B1', 'L1', 'SW1', 'EH1', 'G1', 'LS1', 'S1', 'NE1', 'CF1', 'BT1'];

testPostcodes.forEach(testPostcode => {
  const mp = getMPByPostcode(testPostcode);
  if (mp) {
    console.log(`${testPostcode} -> ${mp.name} (${mp.constituency})`);
  } else {
    console.log(`${testPostcode} -> No MP found`);
  }
});

// Save the updated data
fs.writeFileSync('./public/data/mps.json', JSON.stringify(mps, null, 2));
console.log('\nSaved updated MP data with proper postcode-to-constituency mapping');

// Save the postcode-to-constituency mapping for use in the frontend
fs.writeFileSync('./public/data/postcode-to-constituency.json', JSON.stringify(postcodeToConstituency, null, 2));
console.log('Saved postcode-to-constituency mapping');

// Create a search function for the frontend
const searchFunction = `
// Postcode-to-MP lookup function
function getMPByPostcode(postcode, mps, postcodeToConstituency) {
  // Extract postcode area (e.g., "BS5" from "BS5 1AA")
  const postcodeArea = postcode.replace(/\\s+/g, '').match(/^[A-Z]{1,2}\\d{1,2}[A-Z]?/i);
  if (!postcodeArea) {
    return null;
  }
  
  const area = postcodeArea[0].toUpperCase();
  
  // Find constituency for this postcode area
  const constituency = postcodeToConstituency[area];
  if (!constituency) {
    return null;
  }
  
  // Find MP for this constituency
  const mp = mps.find(mp => mp.constituency === constituency);
  return mp;
}

// Export for use in the application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getMPByPostcode };
}
`;

fs.writeFileSync('./public/data/search-helper.js', searchFunction);
console.log('Created search helper function');
