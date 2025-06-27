const fs = require('fs');

// Load the data files
const mps = JSON.parse(fs.readFileSync('./public/data/mps.json', 'utf8'));
const postcodeToConstituency = JSON.parse(fs.readFileSync('./public/data/postcode-to-constituency.json', 'utf8'));

// Function to get MP by postcode using proper lookup (same as in MPSearch.tsx)
const getMPByPostcode = (postcode) => {
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
};

// Test different postcodes
const testCases = [
  "BS5",
  "BS5 1AA", 
  "M1",
  "M1 1AA",
  "E1",
  "E1 6AN",
  "SW1A 0AA"
];

console.log("Testing current MP search logic:");
console.log("=================================");

testCases.forEach(testCase => {
  const result = getMPByPostcode(testCase);
  console.log(`\nTesting: "${testCase}"`);
  if (result) {
    console.log(`✓ Found: ${result.name} (${result.constituency}, ${result.party})`);
  } else {
    console.log(`✗ No MP found`);
  }
});

// Test a few specific cases for correctness
console.log("\n\nDetailed test for Bristol postcodes:");
console.log("====================================");

const bristolMPs = mps.filter(mp => mp.constituency && mp.constituency.includes('Bristol'));
console.log(`Found ${bristolMPs.length} Bristol MPs:`);
bristolMPs.forEach(mp => {
  console.log(`- ${mp.name} (${mp.constituency})`);
});

console.log("\nTesting BS5 lookup:");
const bs5Result = getMPByPostcode("BS5");
console.log(`BS5 should map to: ${postcodeToConstituency['BS5']}`);
if (bs5Result) {
  console.log(`BS5 returns: ${bs5Result.name} (${bs5Result.constituency})`);
} else {
  console.log("BS5 returns: No MP found");
}
