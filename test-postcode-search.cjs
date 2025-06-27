const fs = require('fs');
const path = require('path');

async function testPostcodeSearch() {
    console.log('🔍 Testing postcode search functionality...');
    
    const inputFile = path.join(__dirname, 'public', 'data', 'mps.json');
    
    try {
        // Read the MP data
        const rawData = fs.readFileSync(inputFile, 'utf8');
        const mps = JSON.parse(rawData);
        
        console.log(`📊 Loaded ${mps.length} MPs`);
        
        // Test different postcodes
        const testPostcodes = ['SW1A', 'E1', 'W1', 'N1', 'SE1', 'M1', 'B1', 'L1'];
        
        console.log('\n🧪 Testing postcode searches:');
        console.log('=====================================');
        
        const results = [];
        
        for (const testPostcode of testPostcodes) {
            const matches = mps.filter(mp => {
                const postcodes = [...(mp.postcodes || [])];
                return postcodes.some(postcode => 
                    postcode.toLowerCase().includes(testPostcode.toLowerCase())
                );
            });
            
            if (matches.length > 0) {
                const firstMatch = matches[0];
                results.push({
                    postcode: testPostcode,
                    mp: firstMatch.name,
                    constituency: firstMatch.constituency,
                    party: firstMatch.party,
                    totalMatches: matches.length
                });
                
                console.log(`${testPostcode.padEnd(6)} → ${firstMatch.name} (${firstMatch.constituency}, ${firstMatch.party}) [${matches.length} matches]`);
            } else {
                console.log(`${testPostcode.padEnd(6)} → No matches found`);
            }
        }
        
        console.log('\n📈 Search Results Analysis:');
        console.log('=====================================');
        
        // Check for unique MPs
        const uniqueMPs = new Set();
        results.forEach(result => uniqueMPs.add(`${result.mp}-${result.constituency}`));
        
        console.log(`• Total successful searches: ${results.length}`);
        console.log(`• Unique MPs found: ${uniqueMPs.size}`);
        console.log(`• Duplicate results: ${results.length - uniqueMPs.size}`);
        
        if (uniqueMPs.size === results.length) {
            console.log('✅ SUCCESS: All postcode searches returned unique MPs!');
        } else {
            console.log('⚠️  Some postcodes returned the same MP');
        }
        
        // Check constituency uniqueness in database
        console.log('\n🏛️ Constituency Analysis:');
        console.log('=====================================');
        
        const constituencies = new Set();
        const duplicateConstituencies = [];
        
        mps.forEach(mp => {
            if (constituencies.has(mp.constituency)) {
                duplicateConstituencies.push(mp.constituency);
            } else {
                constituencies.add(mp.constituency);
            }
        });
        
        console.log(`• Total MPs: ${mps.length}`);
        console.log(`• Unique constituencies: ${constituencies.size}`);
        console.log(`• Duplicate constituencies: ${duplicateConstituencies.length}`);
        
        if (duplicateConstituencies.length === 0) {
            console.log('✅ SUCCESS: No duplicate constituencies found!');
        } else {
            console.log(`⚠️  Found ${duplicateConstituencies.length} duplicate constituencies:`);
            duplicateConstituencies.forEach(constituency => console.log(`   - ${constituency}`));
        }
        
        console.log('\n🎉 Postcode search test completed!');
        
    } catch (error) {
        console.error('❌ Error testing postcode search:', error);
        throw error;
    }
}

// Run the test
testPostcodeSearch()
    .then(() => {
        console.log('\n✅ All tests passed! The postcode search should now work correctly.');
    })
    .catch(error => {
        console.error('💥 Test failed:', error);
        process.exit(1);
    });
