const fs = require('fs');

// Load the postcode mapping
const postcodeToConstituency = JSON.parse(fs.readFileSync('./public/data/postcode-to-constituency.json', 'utf8'));

// Get all unique postcode areas
const areas = Object.keys(postcodeToConstituency);
console.log(`Total postcode areas in mapping: ${areas.length}`);

// Group by prefix
const prefixes = {};
areas.forEach(area => {
  const prefix = area.replace(/\d+$/, '');
  if (!prefixes[prefix]) {
    prefixes[prefix] = [];
  }
  prefixes[prefix].push(area);
});

console.log("\nPostcode areas by prefix:");
Object.keys(prefixes).sort().forEach(prefix => {
  console.log(`${prefix}: ${prefixes[prefix].join(', ')}`);
});

// Check for common London postcodes
const londonPrefixes = ['E', 'EC', 'N', 'NW', 'SE', 'SW', 'W', 'WC'];
console.log("\nLondon postcode coverage:");
londonPrefixes.forEach(prefix => {
  const found = areas.filter(area => area.startsWith(prefix));
  console.log(`${prefix}: ${found.length} areas (${found.slice(0, 10).join(', ')}${found.length > 10 ? '...' : ''})`);
});
