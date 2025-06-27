
// Postcode-to-MP lookup function
function getMPByPostcode(postcode, mps, postcodeToConstituency) {
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

// Export for use in the application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getMPByPostcode };
}
