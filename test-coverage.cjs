const fs = require('fs');

// Load the MP data
const mps = JSON.parse(fs.readFileSync('./public/data/mps.json', 'utf8'));

console.log(`Total MPs in database: ${mps.length}`);
console.log('\nTesting major UK postcode areas:\n');

const testCodes = ['L1', 'B1', 'SW1', 'EC1', 'N1', 'SE1', 'BS1', 'M1', 'GL1', 'LE1', 'NG1'];

testCodes.forEach(code => {
  const matches = mps.filter(mp => 
    mp.postcodes && mp.postcodes.some(pc => 
      pc.toLowerCase().startsWith(code.toLowerCase())
    )
  );
  
  console.log(`${code}: ${matches.length} MPs found`);
  if (matches.length > 0) {
    console.log(`  First: ${matches[0].name} (${matches[0].constituency})`);
  }
  console.log('');
});

// Check if we have good coverage of different cities
console.log('\nChecking city coverage:');
const cities = ['Manchester', 'Birmingham', 'Liverpool', 'Bristol', 'Leeds', 'Sheffield', 'Newcastle', 'Glasgow', 'Edinburgh'];

cities.forEach(city => {
  const cityMPs = mps.filter(mp => 
    mp.constituency && mp.constituency.toLowerCase().includes(city.toLowerCase())
  );
  console.log(`${city}: ${cityMPs.length} MPs`);
});
