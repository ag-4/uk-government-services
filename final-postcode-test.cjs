
const mapping = require('./postcode-mp-mapping-COMPLETE.json');
const mps = require('./scripts/data/complete-parliament-data/mps-complete-all.json');

function findMP(postcode) {
    const cleanPostcode = postcode.toUpperCase().replace(/\s+/g, ' ').trim();
    const mpId = mapping[cleanPostcode];
    if (!mpId) return null;
    
    const mp = mps.find(m => m.id === mpId);
    return mp ? {
        postcode: cleanPostcode,
        mp: mp.displayName,
        constituency: mp.constituency,
        party: mp.party,
        email: mp.email,
        phone: mp.phone
    } : null;
}

// Test function for your website
function searchPostcode(input) {
    // Try exact match first
    let result = findMP(input);
    if (result) return result;
    
    // Try variations
    const variations = [
        input.toUpperCase(),
        input.toUpperCase().replace(/\s+/g, ' '),
        input.toUpperCase().replace(/\s+/g, ''),
        input.replace(/\s+/g, ' ').toUpperCase()
    ];
    
    for (const variation of variations) {
        result = findMP(variation);
        if (result) return result;
    }
    
    return null;
}

// Test all the problematic postcodes
console.log('=== FINAL POSTCODE TEST ===');
const testCodes = ['DN16 1AA', 'HU18 1AB', 'YO16 4AA', 'YO12 1AA', 'TS9 5AA', 'DL1 1AA'];
testCodes.forEach(pc => {
    const result = searchPostcode(pc);
    if (result) {
        console.log(`✅ ${pc}: ${result.mp} (${result.constituency})`);
    } else {
        console.log(`❌ ${pc}: No MP found`);
    }
});

console.log('\n📊 STATISTICS:');
console.log(`Total postcodes mapped: ${Object.keys(mapping).length.toLocaleString()}`);

module.exports = { findMP, searchPostcode };
