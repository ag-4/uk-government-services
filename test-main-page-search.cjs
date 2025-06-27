const fs = require('fs');

console.log('🔍 TESTING MAIN PAGE MP SEARCH FUNCTIONALITY');
console.log('==============================================');

// Test the exact search logic used in the main application
const mps = JSON.parse(fs.readFileSync('public/data/mps.json', 'utf8'));

console.log(`📊 Loaded ${mps.length} MPs from the database`);

// Simulate the search function from MPSearch.tsx
function searchMPsLikeMainApp(searchQuery) {
    const query = searchQuery.toLowerCase().trim();
    
    return mps.filter(mp => {
        // This is the exact search logic from the main app
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

// Test different postcodes that users might search for
const testPostcodes = [
    'AA1', 'AB1', 'AC1', 'AD1', 'AE1',
    'AA2', 'AB2', 'AC2', 'AD2', 'AE2',
    'AA5', 'AB5', 'AC5', 'AD5', 'AE5'
];

console.log('\n🧪 Testing postcode searches (simulating main page search):');
console.log('============================================================');

const searchResults = [];
const uniqueMPs = new Set();

testPostcodes.forEach(postcode => {
    const results = searchMPsLikeMainApp(postcode);
    
    if (results.length > 0) {
        const firstResult = results[0]; // Main app takes first result
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
        
        const status = isNew ? '✅' : '❌ DUPLICATE';
        console.log(`${status} "${postcode}" → ${firstResult.name} (${firstResult.constituency}) [${results.length} total matches]`);
        
        if (!isNew) {
            console.log(`    ^^^ THIS IS THE PROBLEM! Same MP returned for different postcode`);
        }
    } else {
        console.log(`❌ "${postcode}" → No results found`);
    }
});

console.log('\n📊 MAIN PAGE SEARCH ANALYSIS:');
console.log('==============================');
console.log(`Total searches performed: ${testPostcodes.length}`);
console.log(`Successful searches: ${searchResults.length}`);
console.log(`Unique MPs found: ${uniqueMPs.size}`);
console.log(`Duplicate results: ${searchResults.length - uniqueMPs.size}`);

if (uniqueMPs.size === searchResults.length) {
    console.log('\n✅ SUCCESS: All postcodes return unique MPs on main page!');
} else {
    console.log('\n❌ PROBLEM CONFIRMED: Some postcodes return the same MP on main page!');
    console.log('\nDuplicates found:');
    const mpCounts = {};
    searchResults.forEach(result => {
        const mpKey = `${result.mp} (${result.constituency})`;
        if (!mpCounts[mpKey]) {
            mpCounts[mpKey] = [];
        }
        mpCounts[mpKey].push(result.postcode);
    });
    
    Object.entries(mpCounts).forEach(([mp, postcodes]) => {
        if (postcodes.length > 1) {
            console.log(`   ${mp} appears for: ${postcodes.join(', ')}`);
        }
    });
}

// Let's also check the data structure more carefully
console.log('\n🔍 ANALYZING DATA STRUCTURE:');
console.log('=============================');

// Check first few MPs and their postcodes
console.log('First 5 MPs and their postcode prefixes:');
mps.slice(0, 5).forEach((mp, index) => {
    const prefixes = new Set();
    mp.postcodes.forEach(postcode => {
        prefixes.add(postcode.substring(0, 2));
    });
    console.log(`${index + 1}. ${mp.name}: ${Array.from(prefixes).join(', ')}`);
});

// Check if there's overlap in postcode prefixes
console.log('\nChecking for prefix overlaps:');
const allPrefixes = new Map();
let overlapCount = 0;

mps.forEach((mp, mpIndex) => {
    mp.postcodes.forEach(postcode => {
        const prefix = postcode.substring(0, 2);
        if (allPrefixes.has(prefix)) {
            const otherMP = allPrefixes.get(prefix);
            if (otherMP !== mpIndex) {
                console.log(`❌ Prefix "${prefix}" used by both MP ${otherMP} (${mps[otherMP].name}) and MP ${mpIndex} (${mp.name})`);
                overlapCount++;
            }
        } else {
            allPrefixes.set(prefix, mpIndex);
        }
    });
});

if (overlapCount === 0) {
    console.log('✅ No prefix overlaps found in data');
} else {
    console.log(`❌ Found ${overlapCount} prefix overlaps`);
}

console.log('\n🎯 DIAGNOSIS:');
if (uniqueMPs.size < searchResults.length) {
    console.log('The main page search is still returning duplicate MPs for different postcodes.');
    console.log('This means the search algorithm is finding multiple MPs with similar postcodes.');
} else {
    console.log('The main page search appears to be working correctly now.');
}
