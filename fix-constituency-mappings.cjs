const fs = require('fs');
const path = require('path');

// Read MP data to see what constituencies we have
const mpsPath = path.join(__dirname, 'scripts/data/complete-parliament-data/mps-complete-all.json');
const mpsData = JSON.parse(fs.readFileSync(mpsPath, 'utf8'));

// Get all MP constituencies
const mpConstituencies = [...new Set(mpsData
    .filter(mp => mp.constituency && mp.isActive)
    .map(mp => mp.constituency.toLowerCase())
)].sort();

console.log(`Found ${mpConstituencies.length} MP constituencies`);

// Read a sample of postcode constituencies to see mismatches
console.log('\nChecking for constituency mismatches...');

// Get the error file to see what constituencies are failing
const statsPath = path.join(__dirname, 'scripts/data/complete-parliament-data/postcode-mapping-stats.json');
const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));

// Extract unique failing constituencies from errors
const failingConstituencies = [...new Set(stats.errors.map(error => {
    const match = error.match(/No MP found for constituency: "([^"]+)"/);
    return match ? match[1] : null;
}).filter(Boolean))];

console.log('Failing constituencies:');
failingConstituencies.forEach(constName => console.log(`  - ${constName}`));

// Create a mapping of known constituency name changes
const constituencyMappings = {
    // Scottish constituencies that may have changed
    'aberdeen north': 'aberdeen south', // This might be wrong, need to check
    'gordon': 'gordon and buchan',
    'moray': 'aberdeenshire north and moray east',
    
    // Welsh constituencies 
    'ceredigion': 'ceredigion preseli',
    'carmarthen east and dinefwr': 'caerfyrddin',
    'carmarthen west and south pembrokeshire': 'caerfyrddin',
    
    // English constituencies that may have boundary changes
    'ipswich': 'ipswich', // Should match
    
    // Add more mappings as we discover them...
};

console.log('\nManual constituency mappings:');
Object.entries(constituencyMappings).forEach(([old, new_]) => {
    console.log(`  ${old} -> ${new_}`);
});

// Try to find potential matches using fuzzy matching
console.log('\nTrying to find potential matches for failing constituencies...');

const potentialMatches = {};
failingConstituencies.forEach(failing => {
    const matches = mpConstituencies.filter(mp => {
        const words1 = failing.toLowerCase().split(/\s+/);
        const words2 = mp.toLowerCase().split(/\s+/);
        
        // Check if they share significant words
        const sharedWords = words1.filter(w => words2.includes(w) && w.length > 2);
        return sharedWords.length >= 1;
    });
    
    if (matches.length > 0) {
        potentialMatches[failing] = matches;
        console.log(`  "${failing}" could match:`);
        matches.forEach(match => console.log(`    - ${match}`));
    }
});

// Save the mappings for manual review
const mappingsPath = path.join(__dirname, 'constituency-mappings.json');
const mappingData = {
    failingConstituencies,
    mpConstituencies,
    potentialMatches,
    manualMappings: constituencyMappings,
    timestamp: new Date().toISOString()
};

fs.writeFileSync(mappingsPath, JSON.stringify(mappingData, null, 2));
console.log(`\nSaved constituency analysis to: ${mappingsPath}`);

// Now let's create an improved mapping script
console.log('\nGenerating improved mapping...');
