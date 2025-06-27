const fs = require('fs');

console.log('🔍 DEBUGGING BS5 SEARCH ISSUE');
console.log('============================');

const mps = JSON.parse(fs.readFileSync('public/data/mps.json', 'utf8'));

console.log(`📊 Total MPs in database: ${mps.length}`);

// Simulate the exact search the user did
const searchQuery = "BS5";
console.log(`\n🔎 User searched for: "${searchQuery}"`);

// This is the search function from MPSearch.tsx
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

const results = searchMPsLikeMainApp(searchQuery);

console.log(`\n📋 Search Results: Found ${results.length} MPs`);

if (results.length > 0) {
    console.log('\n🎯 First result (what user sees):');
    const firstResult = results[0];
    console.log(`   Name: ${firstResult.name}`);
    console.log(`   Constituency: ${firstResult.constituency}`);
    console.log(`   Party: ${firstResult.party}`);
    
    // Show why this MP was matched
    console.log(`\n🔍 Why this MP was returned for "BS5":`);
    
    const searchFields = [
        { name: 'Name', value: firstResult.name },
        { name: 'Display Name', value: firstResult.displayName },
        { name: 'Constituency', value: firstResult.constituency },
        { name: 'Party', value: firstResult.party },
        { name: 'Postcode', value: firstResult.postcode || 'none' }
    ];
    
    searchFields.forEach(field => {
        if (field.value && field.value.toLowerCase().includes('bs5')) {
            console.log(`   ✅ MATCH in ${field.name}: "${field.value}"`);
        }
    });
    
    // Check postcodes array
    const postcodes = firstResult.postcodes || [];
    const matchingPostcodes = postcodes.filter(pc => pc.toLowerCase().includes('bs5'));
    
    if (matchingPostcodes.length > 0) {
        console.log(`   ✅ MATCH in postcodes array: ${matchingPostcodes.length} postcodes`);
        console.log(`   First few: ${matchingPostcodes.slice(0, 5).join(', ')}`);
    } else {
        console.log(`   ❌ NO MATCH in postcodes array`);
        console.log(`   This MP's postcodes start with: ${postcodes.slice(0, 3).join(', ')}`);
    }
    
    // Show all results, not just the first one
    if (results.length > 1) {
        console.log(`\n📋 All ${results.length} results for "BS5":`);
        results.slice(0, 10).forEach((mp, index) => {
            console.log(`   ${index + 1}. ${mp.name} (${mp.constituency})`);
        });
    }
} else {
    console.log('❌ No results found');
}

// Let's also check if there's an MP who SHOULD match BS5
console.log(`\n🔍 Looking for MPs who SHOULD have BS5 postcodes:`);

// Look for Bristol MPs
const bristolMPs = mps.filter(mp => 
    mp.constituency.toLowerCase().includes('bristol')
);

console.log(`\n🏛️ Found ${bristolMPs.length} Bristol MPs:`);
bristolMPs.forEach(mp => {
    const samplePostcodes = mp.postcodes.slice(0, 3).join(', ');
    console.log(`   ${mp.name} (${mp.constituency}): ${samplePostcodes}...`);
});

// Check if any MP actually has BS5 postcodes
const mpWithBS5 = mps.find(mp => 
    mp.postcodes && mp.postcodes.some(pc => pc.startsWith('BS5'))
);

if (mpWithBS5) {
    console.log(`\n✅ Found MP with BS5 postcodes: ${mpWithBS5.name} (${mpWithBS5.constituency})`);
} else {
    console.log(`\n❌ NO MP found with BS5 postcodes - this is the problem!`);
}

console.log(`\n🎯 DIAGNOSIS:`);
if (results.length > 0 && !results[0].postcodes.some(pc => pc.startsWith('BS5'))) {
    console.log('❌ The search is returning the wrong MP!');
    console.log('❌ The returned MP does not have BS5 postcodes');
    console.log('❌ This means the search algorithm is matching incorrectly');
} else if (results.length === 0) {
    console.log('❌ No results found - no MP has BS5 postcodes');
}

console.log('\n💡 The issue is that postcodes are not properly distributed to match real UK areas!');
