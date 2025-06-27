const fs = require('fs');

console.log('🔍 COMPREHENSIVE POSTCODE SEARCH TEST');
console.log('Testing multiple UK postcodes to verify correct results...');
console.log('===================================================');

const mps = JSON.parse(fs.readFileSync('public/data/mps.json', 'utf8'));

// Simulate the search function from the main app
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

// Test various UK postcodes that users might search for
const testCases = [
    { postcode: 'BS5', expectedArea: 'Bristol' },
    { postcode: 'M1', expectedArea: 'Manchester' },
    { postcode: 'B1', expectedArea: 'Birmingham' },
    { postcode: 'L1', expectedArea: 'Liverpool' },
    { postcode: 'SW1', expectedArea: 'London' },
    { postcode: 'E1', expectedArea: 'London East' },
    { postcode: 'W1', expectedArea: 'London West' },
    { postcode: 'N1', expectedArea: 'London North' },
    { postcode: 'SE1', expectedArea: 'London South East' },
    { postcode: 'G1', expectedArea: 'Glasgow' },
    { postcode: 'EH1', expectedArea: 'Edinburgh' },
    { postcode: 'CF1', expectedArea: 'Cardiff' }
];

console.log('🧪 Testing postcode searches:');
console.log('==============================');

const results = [];
let correctMatches = 0;
let totalTests = 0;

testCases.forEach(({ postcode, expectedArea }) => {
    const searchResults = searchMPsLikeMainApp(postcode);
    totalTests++;
    
    if (searchResults.length > 0) {
        const firstResult = searchResults[0];
        
        // Check if the result makes geographical sense
        const constituency = firstResult.constituency.toLowerCase();
        const isCorrectArea = 
            (expectedArea.includes('Bristol') && constituency.includes('bristol')) ||
            (expectedArea.includes('Manchester') && constituency.includes('manchester')) ||
            (expectedArea.includes('Birmingham') && constituency.includes('birmingham')) ||
            (expectedArea.includes('Liverpool') && constituency.includes('liverpool')) ||
            (expectedArea.includes('Glasgow') && constituency.includes('glasgow')) ||
            (expectedArea.includes('Edinburgh') && constituency.includes('edinburgh')) ||
            (expectedArea.includes('Cardiff') && constituency.includes('cardiff')) ||
            (expectedArea.includes('London') && (
                constituency.includes('london') || 
                constituency.includes('westminster') ||
                constituency.includes('kensington') ||
                constituency.includes('chelsea') ||
                constituency.includes('hammersmith') ||
                constituency.includes('fulham') ||
                constituency.includes('tower hamlets') ||
                constituency.includes('hackney') ||
                constituency.includes('islington') ||
                constituency.includes('camden') ||
                constituency.includes('southwark') ||
                constituency.includes('lambeth')
            ));
        
        if (isCorrectArea) {
            correctMatches++;
        }
        
        const status = isCorrectArea ? '✅ CORRECT' : '❌ WRONG AREA';
        
        console.log(`${status} "${postcode}" → ${firstResult.name} (${firstResult.constituency})`);
        console.log(`   Expected: ${expectedArea}, Got: ${firstResult.constituency}`);
        
        // Show if the MP actually has matching postcodes
        const matchingPostcodes = firstResult.postcodes.filter(pc => 
            pc.toLowerCase().startsWith(postcode.toLowerCase())
        );
        
        if (matchingPostcodes.length > 0) {
            console.log(`   ✅ Has ${matchingPostcodes.length} matching postcodes: ${matchingPostcodes.slice(0, 3).join(', ')}...`);
        } else {
            console.log(`   ❌ No matching postcodes (has: ${firstResult.postcodes.slice(0, 3).join(', ')}...)`);
        }
        
        results.push({
            postcode,
            expectedArea,
            actualMP: firstResult.name,
            actualConstituency: firstResult.constituency,
            isCorrect: isCorrectArea,
            hasMatchingPostcodes: matchingPostcodes.length > 0
        });
    } else {
        console.log(`❌ "${postcode}" → No results found`);
        results.push({
            postcode,
            expectedArea,
            actualMP: 'None',
            actualConstituency: 'None',
            isCorrect: false,
            hasMatchingPostcodes: false
        });
    }
    console.log('');
});

console.log('📊 FINAL RESULTS:');
console.log('==================');
console.log(`Total tests: ${totalTests}`);
console.log(`Correct geographical matches: ${correctMatches}`);
console.log(`Success rate: ${Math.round((correctMatches / totalTests) * 100)}%`);

const withMatchingPostcodes = results.filter(r => r.hasMatchingPostcodes).length;
console.log(`Results with matching postcodes: ${withMatchingPostcodes}`);

if (correctMatches === totalTests) {
    console.log('\n🎉 PERFECT! All postcode searches return geographically correct MPs!');
} else if (correctMatches >= totalTests * 0.8) {
    console.log('\n✅ GOOD! Most postcode searches return correct MPs');
} else {
    console.log('\n⚠️ NEEDS IMPROVEMENT: Many searches still return incorrect MPs');
}

console.log('\n💡 To test this yourself:');
console.log('1. Go to http://localhost:5175/');
console.log('2. Navigate to "Find Your Member of Parliament"');
console.log('3. Try searching: BS5, M1, B1, SW1, etc.');
console.log('4. You should now get MPs from the correct geographical areas!');

// Specific test for the user's BS5 case
console.log('\n🎯 SPECIFIC TEST FOR USER\'S BS5 CASE:');
console.log('======================================');
const bs5Results = searchMPsLikeMainApp('BS5');
if (bs5Results.length > 0) {
    const bristolMPs = bs5Results.filter(mp => 
        mp.constituency.toLowerCase().includes('bristol')
    );
    
    console.log(`BS5 search returns ${bs5Results.length} MPs, ${bristolMPs.length} from Bristol:`);
    bristolMPs.forEach(mp => {
        console.log(`   ✅ ${mp.name} (${mp.constituency})`);
    });
    
    if (bristolMPs.length > 0) {
        console.log('\n🎉 SUCCESS! BS5 now correctly returns Bristol MPs!');
    }
}
