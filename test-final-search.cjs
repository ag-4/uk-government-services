const fs = require('fs');

// Test the new search system
console.log('Testing the updated search system...\n');

// Load the data
const mps = JSON.parse(fs.readFileSync('./public/data/mps.json', 'utf8'));
const postcodeToConstituency = JSON.parse(fs.readFileSync('./public/data/postcode-to-constituency.json', 'utf8'));

// Function to get MP by postcode using proper lookup
function getMPByPostcode(postcode) {
  // Extract postcode area (e.g., "BS5" from "BS5 1AA" or "EH1" from "EH1 2AB")
  const cleaned = postcode.replace(/\s+/g, '').toUpperCase();
  
  // Try different patterns to extract the postcode area
  let area = null;
  
  // Pattern 1: Full postcode like "BS51AA" -> extract "BS5"
  const fullMatch = cleaned.match(/^([A-Z]{1,2}\d{1,2}[A-Z]?)\d[A-Z]{2}$/);
  if (fullMatch) {
    area = fullMatch[1];
  } else {
    // Pattern 2: Area code only like "BS5"
    const areaMatch = cleaned.match(/^([A-Z]{1,2}\d{1,2}[A-Z]?)$/);
    if (areaMatch) {
      area = areaMatch[1];
    }
  }
  
  if (!area) {
    return null;
  }
  
  // Find constituency for this postcode area
  const constituency = postcodeToConstituency[area];
  if (!constituency) {
    return null;
  }
  
  // Find MP for this constituency
  const mp = mps.find(mp => mp.constituency === constituency);
  return mp || null;
}

// Test various postcodes
const testCases = [
  'BS5',
  'BS5 1AA', 
  'M1',
  'M1 1AA',
  'B1', 
  'B1 1AA',
  'L1',
  'L1 1AA',
  'SW1',
  'SW1 1AA',
  'S1',
  'S1 1AA',
  'BT1',
  'BT1 1AA',
  'CF1',
  'CF1 1AA',
  'LS1',
  'LS1 1AA',
  'EH1',
  'EH1 1AA',
  'G1',
  'G1 1AA',
  'NE1',
  'NE1 1AA'
];

console.log('=== Postcode-to-MP Lookup Tests ===');
testCases.forEach(postcode => {
  const mp = getMPByPostcode(postcode);
  if (mp) {
    console.log(`✅ ${postcode.padEnd(8)} -> ${mp.name} (${mp.constituency})`);
  } else {
    console.log(`❌ ${postcode.padEnd(8)} -> No MP found`);
  }
});

// Test edge cases
console.log('\n=== Edge Case Tests ===');
const edgeCases = [
  'invalid',
  'Z99',
  'BS99',
  'M99',
  'XXX'
];

edgeCases.forEach(postcode => {
  const mp = getMPByPostcode(postcode);
  if (mp) {
    console.log(`⚠️  ${postcode.padEnd(8)} -> ${mp.name} (${mp.constituency}) - Unexpected result!`);
  } else {
    console.log(`✅ ${postcode.padEnd(8)} -> No MP found (correct)`);
  }
});

// Count MPs with postcodes for each major city
console.log('\n=== Coverage Statistics ===');
const cities = {
  'Bristol': ['BS'],
  'Manchester': ['M'],
  'Birmingham': ['B'],
  'Liverpool': ['L'],
  'London': ['SW', 'W', 'EC'],
  'Sheffield': ['S'],
  'Belfast': ['BT'],
  'Cardiff': ['CF'],
  'Leeds': ['LS'],
  'Edinburgh': ['EH'],
  'Glasgow': ['G'],
  'Newcastle': ['NE']
};

Object.entries(cities).forEach(([city, prefixes]) => {
  const relevantMPs = mps.filter(mp => 
    mp.postcodes && mp.postcodes.some(pc => 
      prefixes.some(prefix => pc.startsWith(prefix))
    )
  );
  console.log(`${city.padEnd(12)}: ${relevantMPs.length} MPs with postcodes`);
});

console.log('\n=== Database Summary ===');
console.log(`Total MPs: ${mps.length}`);
console.log(`MPs with postcodes: ${mps.filter(mp => mp.postcodes && mp.postcodes.length > 0).length}`);
console.log(`Postcode areas mapped: ${Object.keys(postcodeToConstituency).length}`);
console.log(`Constituencies covered: ${new Set(Object.values(postcodeToConstituency)).size}`);
