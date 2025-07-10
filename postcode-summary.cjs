const mapping = require('./postcode-mp-mapping-COMPREHENSIVE.json');
const originalMapping = require('./postcode-mp-mapping-FINAL.json');

console.log('📊 POSTCODE MAPPING SUMMARY');
console.log('=============================');
console.log(`Original postcodes: ${Object.keys(originalMapping).length.toLocaleString()}`);
console.log(`Final postcodes: ${Object.keys(mapping).length.toLocaleString()}`);
console.log(`New postcodes added: ${(Object.keys(mapping).length - Object.keys(originalMapping).length).toLocaleString()}`);
console.log(`Improvement: +${(((Object.keys(mapping).length - Object.keys(originalMapping).length) / Object.keys(originalMapping).length) * 100).toFixed(1)}%`);

// Test a variety of postcodes
console.log('\n🧪 TESTING DIVERSE POSTCODES:');
const testCodes = [
    'SW1A 0AA', // Westminster 
    'HU18 1AB', // East Yorkshire (fixed)
    'YO16 4AA', // East Yorkshire (fixed)
    'DN16 1AA', // Scunthorpe (fixed)
    'M1 1AA',   // Manchester
    'B1 1AA',   // Birmingham  
    'LS1 1AA',  // Leeds
    'G1 1AA',   // Glasgow
    'CF10 1AA', // Cardiff
    'BT1 1AA',  // Belfast
    'EH1 1AA',  // Edinburgh
    'L1 1AA',   // Liverpool
    'NE1 1AA',  // Newcastle
    'S1 1AA',   // Sheffield
    'NG1 1AA'   // Nottingham
];

let found = 0;
testCodes.forEach(code => {
    if (mapping[code]) {
        found++;
        console.log(`  ✅ ${code}: Found`);
    } else {
        console.log(`  ❌ ${code}: Missing`);
    }
});

console.log(`\n📈 Test Coverage: ${found}/${testCodes.length} (${((found/testCodes.length)*100).toFixed(1)}%)`);

console.log('\n🎯 RECOMMENDATIONS:');
if (found >= 12) {
    console.log('✅ Excellent coverage! Your system should handle most UK postcodes.');
} else if (found >= 8) {
    console.log('✅ Good coverage! Most major areas are covered.');
} else {
    console.log('⚠️  Limited coverage. Consider expanding the constituency mappings.');
}

console.log('\n📁 FILES CREATED:');
console.log('• postcode-mp-mapping-COMPREHENSIVE.json - Complete mapping with all fixes');
console.log('• postcode-search.cjs - Optimized search function for your application');
console.log('• fix-all-missing-postcodes.cjs - Script to add more postcodes in future');
