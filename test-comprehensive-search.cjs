const fs = require('fs');

// Load the updated data files
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

// Comprehensive test of London postcodes
const londonTestCases = [
  // Central London
  "EC1", "EC1A 1BB", "EC2", "EC3", "EC4",
  "WC1", "WC1A 1AA", "WC2", "SW1", "SW1A 0AA",
  
  // East London  
  "E1", "E1 6AN", "E2", "E3", "E5", "E6", "E8", "E10", "E11", "E12", "E13", "E14", "E16", "E17",
  
  // North London
  "N1", "N3", "N7", "N8", "N10", "N11", "N12", "N16",
  "NW1", "NW2", "NW4", "NW9", "NW10", "NW11",
  
  // West London
  "W2", "W3", "W4", "W5", "W6	", "W8", "W9", "W11", "W12", "W13",
  "TW1", "TW2", "TW7", "TW8", "TW9", "TW10", "TW11", "TW12", "TW13", "TW14",
  "UB1", "UB2", "UB3",
  "HA0", "HA1", "HA2", "HA3",
  
  // South London
  "SE1", "SE5", "SE6", "SE7", "SE9", "SE10", "SE12", "SE13", "SE14", "SE15", "SE16", "SE18", "SE19", "SE21", "SE22", "SE23", "SE24", "SE25", "SE27",
  "SW2", "SW3", "SW6", "SW8", "SW11", "SW14", "SW15", "SW16", "SW17", "SW18", "SW19", "SW20",
  "CR0", "CR2", "CR4", "CR7", "CR8",
  "BR1", "BR2", "BR6", "BR7",
  "KT1", "KT2", "KT5", "KT6",
  "SM1", "SM2", "SM3", "SM4",
  
  // Outer London
  "IG11", "RM8", "RM9", "RM10"
];

console.log("Testing London postcode coverage:");
console.log("=".repeat(50));

let successCount = 0;
let totalCount = 0;

londonTestCases.forEach(testCase => {
  totalCount++;
  const result = getMPByPostcode(testCase);
  if (result) {
    console.log(`✓ ${testCase.padEnd(8)} -> ${result.name} (${result.constituency})`);
    successCount++;
  } else {
    console.log(`✗ ${testCase.padEnd(8)} -> No MP found`);
  }
});

console.log("\n" + "=".repeat(50));
console.log(`Success rate: ${successCount}/${totalCount} (${Math.round(successCount/totalCount*100)}%)`);

// Test some non-London postcodes too
console.log("\n\nTesting other UK postcodes:");
console.log("=".repeat(50));

const otherTestCases = [
  "M1", "M2", "M3", "M4", "M15", "M20", "M21", // Manchester
  "B1", "B2", "B15", "B16", "B20", "B21", // Birmingham  
  "L1", "L2", "L3", "L8", "L15", "L18", // Liverpool
  "LS1", "LS2", "LS6", "LS11", "LS15", // Leeds
  "S1", "S2", "S6", "S10", "S11", // Sheffield
  "G1", "G2", "G12", "G20", "G31", // Glasgow
  "EH1", "EH4", "EH10", "EH15", // Edinburgh
  "CF1", "CF10", "CF24", // Cardiff
  "BT1", "BT9", "BT15" // Belfast
];

let otherSuccessCount = 0;
let otherTotalCount = 0;

otherTestCases.forEach(testCase => {
  otherTotalCount++;
  const result = getMPByPostcode(testCase);
  if (result) {
    console.log(`✓ ${testCase.padEnd(6)} -> ${result.name} (${result.constituency})`);
    otherSuccessCount++;
  } else {
    console.log(`✗ ${testCase.padEnd(6)} -> No MP found`);
  }
});

console.log("\n" + "=".repeat(50));
console.log(`Other UK success rate: ${otherSuccessCount}/${otherTotalCount} (${Math.round(otherSuccessCount/otherTotalCount*100)}%)`);
console.log(`Overall success rate: ${successCount + otherSuccessCount}/${totalCount + otherTotalCount} (${Math.round((successCount + otherSuccessCount)/(totalCount + otherTotalCount)*100)}%)`);

console.log(`\nTotal postcode areas in mapping: ${Object.keys(postcodeToConstituency).length}`);
console.log(`Total MPs in database: ${mps.length}`);
console.log(`Unique constituencies: ${[...new Set(mps.map(mp => mp.constituency))].length}`);
