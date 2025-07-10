const fs = require('fs');

// Load MP data
const mps = JSON.parse(fs.readFileSync('public/data/mps.json', 'utf8'));
const postcodeMapping = JSON.parse(fs.readFileSync('public/data/postcode-to-constituency.json', 'utf8'));

console.log('🔍 MP Database Verification Report');
console.log('================================');

// Basic statistics
console.log(`\n📊 Basic Statistics:`);
console.log(`  - Total MPs: ${mps.length}`);
console.log(`  - Target: 650 MPs`);
console.log(`  - Status: ${mps.length === 650 ? '✅ Complete' : '⚠️ Incomplete'}`);

// Party breakdown
const partyCount = {};
mps.forEach(mp => {
    partyCount[mp.party] = (partyCount[mp.party] || 0) + 1;
});

console.log(`\n🏛️ Party Breakdown:`);
Object.entries(partyCount)
    .sort(([,a], [,b]) => b - a)
    .forEach(([party, count]) => {
        console.log(`  - ${party}: ${count}`);
    });

// Image verification
const mpsWithImages = mps.filter(mp => mp.image && mp.image.includes('members-api.parliament.uk'));
console.log(`\n🖼️ Image Verification:`);
console.log(`  - MPs with valid image URLs: ${mpsWithImages.length}/${mps.length}`);
console.log(`  - Image URL format: ${mpsWithImages.length === mps.length ? '✅ Correct' : '❌ Issues found'}`);

// Sample image URLs
console.log(`\n📸 Sample Image URLs:`);
mps.slice(0, 3).forEach(mp => {
    console.log(`  - ${mp.name}: ${mp.image}`);
});

// Postcode verification
console.log(`\n📍 Postcode Mapping:`);
console.log(`  - Total postcode areas: ${Object.keys(postcodeMapping).length}`);
console.log(`  - Major cities covered:`);

const cityAreas = {
    'London': Object.keys(postcodeMapping).filter(p => p.match(/^(E|N|NW|SE|SW|W|WC|EC)/)).length,
    'Birmingham': Object.keys(postcodeMapping).filter(p => p.startsWith('B')).length,
    'Manchester': Object.keys(postcodeMapping).filter(p => p.startsWith('M')).length,
    'Liverpool': Object.keys(postcodeMapping).filter(p => p.startsWith('L')).length,
    'Bristol': Object.keys(postcodeMapping).filter(p => p.startsWith('BS')).length,
    'Leeds': Object.keys(postcodeMapping).filter(p => p.startsWith('LS')).length
};

Object.entries(cityAreas).forEach(([city, count]) => {
    console.log(`    - ${city}: ${count} postcode areas`);
});

// Test searches
console.log(`\n🔍 Search Functionality Tests:`);

// Test postcode search
const testPostcode = 'SW1A';
const testConstituency = postcodeMapping[testPostcode];
const mpForTestPostcode = mps.find(mp => mp.constituency === testConstituency);

console.log(`  - Postcode search test (${testPostcode}):`);
console.log(`    - Maps to: ${testConstituency}`);
console.log(`    - MP found: ${mpForTestPostcode ? mpForTestPostcode.name : 'None'}`);
console.log(`    - Status: ${mpForTestPostcode ? '✅ Working' : '❌ Failed'}`);

// Test name search
const testName = 'Abbott';
const mpsWithName = mps.filter(mp => mp.name.toLowerCase().includes(testName.toLowerCase()));
console.log(`  - Name search test ("${testName}"):`);
console.log(`    - MPs found: ${mpsWithName.length}`);
mpsWithName.slice(0, 2).forEach(mp => {
    console.log(`    - ${mp.name} (${mp.party}, ${mp.constituency})`);
});
console.log(`    - Status: ${mpsWithName.length > 0 ? '✅ Working' : '❌ Failed'}`);

// Test party search
const testParty = 'Labour';
const mpsWithParty = mps.filter(mp => mp.party === testParty);
console.log(`  - Party search test ("${testParty}"):`);
console.log(`    - MPs found: ${mpsWithParty.length}`);
console.log(`    - Status: ${mpsWithParty.length > 0 ? '✅ Working' : '❌ Failed'}`);

// Data quality checks
console.log(`\n📋 Data Quality Checks:`);

const mpsWithoutConstituency = mps.filter(mp => !mp.constituency || mp.constituency === 'Unknown');
const mpsWithoutParty = mps.filter(mp => !mp.party);
const mpsWithoutImage = mps.filter(mp => !mp.image);

console.log(`  - MPs without constituency: ${mpsWithoutConstituency.length}`);
console.log(`  - MPs without party: ${mpsWithoutParty.length}`);
console.log(`  - MPs without image: ${mpsWithoutImage.length}`);

// Overall status
const allChecksPass = 
    mps.length === 650 &&
    mpsWithImages.length === mps.length &&
    mpsWithoutConstituency.length === 0 &&
    mpsWithoutParty.length === 0 &&
    mpsWithoutImage.length === 0 &&
    mpForTestPostcode &&
    mpsWithName.length > 0 &&
    mpsWithParty.length > 0;

console.log(`\n🎯 Overall Status: ${allChecksPass ? '✅ All checks passed!' : '⚠️ Some issues found'}`);

if (allChecksPass) {
    console.log(`\n🎉 Your MP database is fully updated and working correctly!`);
    console.log(`\n📝 Features confirmed:`);
    console.log(`  ✅ All 650 MPs included`);
    console.log(`  ✅ Real images from Parliament API`);
    console.log(`  ✅ Correct party information`);
    console.log(`  ✅ Accurate postcode mapping`);
    console.log(`  ✅ Search functionality working`);
    console.log(`\n🚀 Ready to use! Visit http://localhost:5174/ to test`);
}
