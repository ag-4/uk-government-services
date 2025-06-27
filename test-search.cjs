const fs = require('fs');

// Load the MP data
const mps = JSON.parse(fs.readFileSync('./public/data/mps.json', 'utf8'));

console.log('Testing search functionality...\n');

function testSearch(query) {
  console.log(`=== Testing search for: "${query}" ===`);
  
  const scoredMPs = mps.map(mp => {
    let score = 0;
    let hasMatch = false;
    
    // Check postcodes first (highest priority)
    const postcodes = mp.postcodes || [];
    const postcodeMatches = postcodes.filter(pc => 
      pc && pc.toLowerCase().includes(query.toLowerCase())
    );
    
    if (postcodeMatches.length > 0) {
      score += 100;
      hasMatch = true;
      
      // Bonus for exact prefix matches
      const exactPrefixMatches = postcodes.filter(pc => 
        pc && pc.toLowerCase().startsWith(query.toLowerCase())
      );
      if (exactPrefixMatches.length > 0) {
        score += 50;
      }
    }
    
    // Check other fields (lower priority)
    const otherFields = [
      mp.name,
      mp.displayName,
      mp.constituency,
      mp.party,
      mp.postcode || ''
    ];
    
    otherFields.forEach(field => {
      if (field && field.toLowerCase().includes(query.toLowerCase())) {
        score += 10;
        hasMatch = true;
      }
    });
    
    return hasMatch ? { mp, score } : null;
  }).filter(Boolean);
  
  // Sort by score (highest first)
  const results = scoredMPs
    .sort((a, b) => (b?.score || 0) - (a?.score || 0))
    .map(item => item?.mp)
    .filter(Boolean);
  
  console.log(`Found ${results.length} results:`);
  results.slice(0, 5).forEach((mp, i) => {
    const scoreData = scoredMPs.find(s => s.mp === mp);
    const score = scoreData ? scoreData.score : 0;
    const samplePostcodes = mp.postcodes ? mp.postcodes.slice(0, 3).join(', ') : 'None';
    console.log(`${i+1}. ${mp.name} (${mp.constituency}) - Score: ${score}`);
    console.log(`   Sample postcodes: ${samplePostcodes}`);
  });
  
  console.log('');
  return results;
}

// Test various searches
testSearch('BS5');
testSearch('BS1');
testSearch('M1');
testSearch('Bristol');
testSearch('Kerry McCarthy');
testSearch('Labour');
