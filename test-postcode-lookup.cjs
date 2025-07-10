
// Quick postcode lookup test
const mapping = require('./postcode-mp-mapping-FINAL.json');
const mps = require('./scripts/data/complete-parliament-data/mps-complete-all.json');

function findMP(postcode) {
    const mpId = mapping[postcode.toUpperCase().replace(/\s+/g, ' ')];
    if (!mpId) return null;
    
    const mp = mps.find(m => m.id === mpId);
    return mp ? {
        postcode: postcode,
        mp: mp.displayName,
        constituency: mp.constituency,
        party: mp.party,
        email: mp.email
    } : null;
}

// Test the problematic postcodes
const testPostcodes = [
    'DN16 1AA', 'HU18 1AB', 'YO16 4AA', 'YO12 1AA', 'TS9 5AA', 'DL1 1AA'
];

console.log('=== POSTCODE LOOKUP TEST ===');
testPostcodes.forEach(pc => {
    const result = findMP(pc);
    if (result) {
        console.log(`✅ ${pc}: ${result.mp} (${result.constituency})`);
    } else {
        console.log(`❌ ${pc}: No MP found`);
    }
});

module.exports = { findMP };
