
// OPTIMIZED POSTCODE SEARCH FUNCTION
const postcodeMapping = require('./postcode-mp-mapping-COMPREHENSIVE.json');
const mpsData = require('./scripts/data/complete-parliament-data/mps-complete-all.json');

function findMPByPostcode(postcode) {
    if (!postcode) return null;
    
    // Clean and normalize postcode
    const cleanPostcode = postcode.toUpperCase().replace(/\s+/g, ' ').trim();
    
    // Try direct lookup
    const mpId = postcodeMapping[cleanPostcode];
    if (!mpId) return null;
    
    // Find MP details
    const mp = mpsData.find(m => m.id === mpId);
    if (!mp) return null;
    
    return {
        postcode: cleanPostcode,
        mp: {
            id: mp.id,
            name: mp.displayName,
            constituency: mp.constituency,
            party: mp.party,
            email: mp.email,
            phone: mp.phone,
            image: mp.thumbnailUrl
        }
    };
}

// Export for use in your application
module.exports = { findMPByPostcode };

// CLI test
if (require.main === module) {
    const testCodes = process.argv.slice(2);
    if (testCodes.length > 0) {
        testCodes.forEach(code => {
            const result = findMPByPostcode(code);
            if (result) {
                console.log(`✅ ${result.postcode}: ${result.mp.name} (${result.mp.constituency}) - ${result.mp.party}`);
            } else {
                console.log(`❌ ${code}: No MP found`);
            }
        });
    } else {
        console.log('Usage: node postcode-search.js <postcode1> [postcode2] ...');
    }
}
