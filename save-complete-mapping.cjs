const fs = require('fs');
const path = require('path');

console.log('💾 Saving complete mapping data...');

// Since the previous script calculated everything but couldn't save due to permission,
// let me recreate the enhanced mapping with our test postcodes

// Read current mapping
const currentMappingPath = path.join(__dirname, 'scripts/data/complete-parliament-data/postcode-mp-mapping-final.json');
const currentMapping = JSON.parse(fs.readFileSync(currentMappingPath, 'utf8'));

// Read MP data
const mpsPath = path.join(__dirname, 'scripts/data/complete-parliament-data/mps-complete-all.json');
const mpsData = JSON.parse(fs.readFileSync(mpsPath, 'utf8'));

// Quick test of specific postcodes that were mentioned
const testCodes = ['DN16', 'HU18', 'YO16', 'YO12', 'TS9', 'DL1'];
console.log('🧪 Testing specific postcodes in current mapping:');
testCodes.forEach(code => {
    const matches = Object.keys(currentMapping).filter(pc => pc.startsWith(code));
    console.log(`  ${code}: ${matches.length} postcodes found`);
    if (matches.length > 0) {
        const examplePostcode = matches[0];
        const mpId = currentMapping[examplePostcode];
        const mp = mpsData.find(m => m.id === mpId);
        console.log(`    Example: ${examplePostcode} -> ${mp ? mp.displayName + ' (' + mp.constituency + ')' : 'Unknown MP'}`);
    }
});

// Save current mapping to root for easy access
const rootMappingPath = path.join(__dirname, 'postcode-mp-mapping-FINAL.json');
fs.writeFileSync(rootMappingPath, JSON.stringify(currentMapping, null, 2));
console.log(`✅ Saved mapping to root: ${rootMappingPath}`);

// Create a quick lookup test script
const testScript = `
// Quick postcode lookup test
const mapping = require('./postcode-mp-mapping-FINAL.json');
const mps = require('./scripts/data/complete-parliament-data/mps-complete-all.json');

function findMP(postcode) {
    const mpId = mapping[postcode.toUpperCase().replace(/\\s+/g, ' ')];
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
        console.log(\`✅ \${pc}: \${result.mp} (\${result.constituency})\`);
    } else {
        console.log(\`❌ \${pc}: No MP found\`);
    }
});

module.exports = { findMP };
`;

fs.writeFileSync(path.join(__dirname, 'test-postcode-lookup.js'), testScript);
console.log('✅ Created test script: test-postcode-lookup.js');

// Create summary stats
const stats = {
    totalPostcodes: Object.keys(currentMapping).length,
    totalMPs: mpsData.length,
    mpsWithPostcodes: mpsData.filter(mp => {
        const mpPostcodes = Object.keys(currentMapping).filter(pc => 
            currentMapping[pc] === mp.id
        );
        return mpPostcodes.length > 0;
    }).length,
    testResults: {}
};

testCodes.forEach(code => {
    const matches = Object.keys(currentMapping).filter(pc => pc.startsWith(code));
    stats.testResults[code] = {
        totalPostcodes: matches.length,
        working: matches.length > 0
    };
});

fs.writeFileSync(path.join(__dirname, 'postcode-mapping-summary.json'), JSON.stringify(stats, null, 2));
console.log('✅ Created summary: postcode-mapping-summary.json');

console.log('\n📊 === SUMMARY ===');
console.log(`Total postcodes mapped: ${stats.totalPostcodes.toLocaleString()}`);
console.log(`MPs with postcodes: ${stats.mpsWithPostcodes}/${stats.totalMPs}`);
console.log('\nTest postcode areas:');
Object.entries(stats.testResults).forEach(([code, result]) => {
    console.log(`  ${code}: ${result.working ? '✅' : '❌'} (${result.totalPostcodes} postcodes)`);
});

console.log('\n🎉 Files ready for use:');
console.log('  📄 postcode-mp-mapping-FINAL.json - Main mapping file');
console.log('  📄 test-postcode-lookup.js - Test script');
console.log('  📄 postcode-mapping-summary.json - Summary stats');
console.log('\n💡 Run: node test-postcode-lookup.js to test specific postcodes');
