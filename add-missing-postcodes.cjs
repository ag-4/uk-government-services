const fs = require('fs');

// Load the current postcode mapping and add missing areas
const postcodeToConstituency = JSON.parse(fs.readFileSync('./public/data/postcode-to-constituency.json', 'utf8'));

// Add missing postcode areas
const additionalMappings = {
  // More Edinburgh constituencies
  'EH1': 'Edinburgh Central',
  'EH2': 'Edinburgh Central',
  'EH3': 'Edinburgh Central',
  'EH8': 'Edinburgh Central',
  'EH9': 'Edinburgh Central',

  // More Glasgow constituencies  
  'G1': 'Glasgow Central',
  'G2': 'Glasgow Central',
  'G3': 'Glasgow Central',
  'G4': 'Glasgow Central',
  'G5': 'Glasgow Central',

  // More Cardiff constituencies
  'CF1': 'Cardiff Central',
  'CF2': 'Cardiff Central',
  'CF10': 'Cardiff Central',
  'CF24': 'Cardiff Central',

  // More Leeds constituencies
  'LS1': 'Leeds Central',
  'LS2': 'Leeds Central', 
  'LS3': 'Leeds Central',

  // More Newcastle constituencies
  'NE1': 'Newcastle upon Tyne Central',
  'NE2': 'Newcastle upon Tyne Central',
  'NE4': 'Newcastle upon Tyne Central',
  'NE15': 'Newcastle upon Tyne Central'
};

// Merge the additional mappings
Object.assign(postcodeToConstituency, additionalMappings);

// Save the updated mapping
fs.writeFileSync('./public/data/postcode-to-constituency.json', JSON.stringify(postcodeToConstituency, null, 2));
console.log('Added missing postcode areas to mapping');

// Also need to check if we have MPs for these constituencies in our database
const mps = JSON.parse(fs.readFileSync('./public/data/mps.json', 'utf8'));
const constituencies = new Set(Object.values(postcodeToConstituency));

console.log('\nChecking for missing MPs...');
constituencies.forEach(constituency => {
  const mp = mps.find(mp => mp.constituency === constituency);
  if (!mp) {
    console.log(`❌ Missing MP for: ${constituency}`);
  }
});

console.log('\nUpdated postcode mapping with missing areas');
