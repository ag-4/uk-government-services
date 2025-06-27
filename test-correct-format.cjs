const fs = require('fs');

console.log('🔍 TESTING MAIN PAGE WITH CORRECT 4-CHARACTER POSTCODE FORMAT');
console.log('==============================================================');

const mps = JSON.parse(fs.readFileSync('public/data/mps.json', 'utf8'));

console.log(`📊 Loaded ${mps.length} MPs from the database`);

// Check the actual postcode format first
console.log('\n🔍 Checking actual postcode format:');
mps.slice(0, 5).forEach((mp, index) => {
    const samplePostcodes = mp.postcodes.slice(0, 3);
    console.log(`${index + 1}. ${mp.name}: ${samplePostcodes.join(', ')}`);
});

// Simulate the search function from MPSearch.tsx
function searchMPsLikeMainApp(searchQuery) {
    const query = searchQuery.toLowerCase().trim();
    
    return mps.filter(mp => {
        const searchFields = [
            mp.name,
            mp.displayName,
            mp.constituency,
            mp.party,
            mp.postcode || '',
            ...(mp.postcodes || []),
            ...(mp.fullPostcodes || []),
            ...(mp.constituencyPostcodes || [])
        ];
        
        return searchFields.some(field => 
            field && field.toLowerCase().includes(query)
        );
    });
}

// Test with the correct 4-character format based on actual data
const testPostcodes = [
    'AA01', 'AB02', 'AC03', 'AD04', 'AE05',   // Different MPs
    'AA01', 'AA01', 'AB02', 'AB02', 'AC03'    // Duplicates to test
];

console.log('\n🧪 Testing postcode searches with correct format:');
console.log('===================================================');

const searchResults = [];
const uniqueMPs = new Set();

testPostcodes.forEach((postcode, index) => {
    const results = searchMPsLikeMainApp(postcode);
    
    if (results.length > 0) {
        const firstResult = results[0];
        const mpKey = `${firstResult.name}-${firstResult.constituency}`;
        
        searchResults.push({
            postcode,
            mp: firstResult.name,
            constituency: firstResult.constituency,
            party: firstResult.party,
            totalMatches: results.length,
            isUnique: !uniqueMPs.has(mpKey)
        });
        
        const isNew = !uniqueMPs.has(mpKey);
        uniqueMPs.add(mpKey);
        
        const status = isNew ? '✅ NEW' : '❌ DUPLICATE';
        console.log(`${status} "${postcode}" → ${firstResult.name} (${firstResult.constituency}) [${results.length} total matches]`);
        
        if (!isNew) {
            console.log(`    ^^^ This postcode returned the same MP as a previous search`);
        }
    } else {
        console.log(`❌ "${postcode}" → No results found`);
    }
});

// Remove duplicates from test array to get unique test count
const uniqueTestPostcodes = [...new Set(testPostcodes)];

console.log('\n📊 FINAL RESULTS:');
console.log('==================');
console.log(`Total searches performed: ${testPostcodes.length}`);
console.log(`Unique postcodes tested: ${uniqueTestPostcodes.length}`);
console.log(`Successful searches: ${searchResults.length}`);
console.log(`Unique MPs found: ${uniqueMPs.size}`);
console.log(`Expected unique MPs: ${uniqueTestPostcodes.filter(pc => searchResults.some(r => r.postcode === pc)).length}`);

// Test with partial postcode searches (like users might type)
console.log('\n🧪 Testing partial postcode searches (simulating real user input):');
console.log('====================================================================');

const partialTests = ['AA0', 'AB0', 'AC0', 'AD0', 'AE0'];
const partialResults = [];
const partialUniqueMPs = new Set();

partialTests.forEach(partial => {
    const results = searchMPsLikeMainApp(partial);
    
    if (results.length > 0) {
        const firstResult = results[0];
        const mpKey = `${firstResult.name}-${firstResult.constituency}`;
        
        const isNew = !partialUniqueMPs.has(mpKey);
        partialUniqueMPs.add(mpKey);
        
        partialResults.push({ partial, mp: firstResult, isNew });
        
        const status = isNew ? '✅ NEW' : '❌ DUPLICATE';
        console.log(`${status} "${partial}" → ${firstResult.name} (${firstResult.constituency})`);
    } else {
        console.log(`❌ "${partial}" → No results found`);
    }
});

console.log('\n🎯 FINAL DIAGNOSIS:');
console.log('====================');

if (partialUniqueMPs.size === partialResults.length && partialResults.length > 0) {
    console.log('🎉 SUCCESS! The main page MP search is now working correctly!');
    console.log('✅ Different postcodes return different MPs');
    console.log('✅ No duplicate results found');
    console.log('✅ Users will get unique MPs for different postcode searches');
} else if (partialResults.length === 0) {
    console.log('⚠️  No search results found - may need to adjust postcode format');
} else {
    console.log('❌ Still finding duplicate results in main page search');
    
    // Show which MPs appeared multiple times
    const mpCounts = {};
    partialResults.forEach(result => {
        const mpKey = `${result.mp.name} (${result.mp.constituency})`;
        if (!mpCounts[mpKey]) {
            mpCounts[mpKey] = [];
        }
        mpCounts[mpKey].push(result.partial);
    });
    
    Object.entries(mpCounts).forEach(([mp, searches]) => {
        if (searches.length > 1) {
            console.log(`   ${mp} appeared for: ${searches.join(', ')}`);
        }
    });
}

console.log('\n💡 To test this on the actual website:');
console.log('   1. Go to http://localhost:5175/');
console.log('   2. Navigate to the "Find Your MP" section');
console.log('   3. Try searching for: AA0, AB0, AC0, AD0, AE0');
console.log('   4. Each search should return a different MP');
