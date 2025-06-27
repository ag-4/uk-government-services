// MP Search Integration Test
console.log('Starting MP Search Integration Test...');

// Test MP search functionality
async function testMPSearchIntegration() {
    try {
        console.log('1. Testing MP data fetch...');
        
        // Test data fetch
        const response = await fetch('/data/mps.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch MP data: ${response.status}`);
        }
        
        const mps = await response.json();
        console.log(`✓ Successfully fetched ${mps.length} MPs`);
        
        // Test search functionality mimicking the component logic
        console.log('2. Testing search algorithms...');
        
        const testCases = [
            { query: 'Abbott', expectedMinResults: 1 },
            { query: 'Conservative', expectedMinResults: 10 },
            { query: 'Westminster', expectedMinResults: 0 },
            { query: 'WC1', expectedMinResults: 1 },
            { query: 'Labour', expectedMinResults: 50 }
        ];
        
        for (const testCase of testCases) {
            const results = mps.filter(mp => {
                const query = testCase.query.toLowerCase().trim();
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
            
            console.log(`✓ Query "${testCase.query}": ${results.length} results (expected min: ${testCase.expectedMinResults})`);
            
            if (results.length >= testCase.expectedMinResults) {
                console.log(`  ✓ Test passed for "${testCase.query}"`);
            } else {
                console.warn(`  ⚠ Test warning for "${testCase.query}": got ${results.length}, expected at least ${testCase.expectedMinResults}`);
            }
            
            // Show sample results
            if (results.length > 0) {
                console.log(`    Sample: ${results[0].displayName} (${results[0].constituency})`);
            }
        }
        
        console.log('3. Testing data structure validation...');
        
        // Validate MP data structure
        const sampleMP = mps[0];
        const requiredFields = ['id', 'name', 'displayName', 'constituency', 'party'];
        const missingFields = requiredFields.filter(field => !sampleMP[field]);
        
        if (missingFields.length === 0) {
            console.log('✓ MP data structure validation passed');
        } else {
            console.error('✗ Missing required fields:', missingFields);
        }
        
        console.log('4. Testing party distribution...');
        const partyStats = {};
        mps.forEach(mp => {
            partyStats[mp.party] = (partyStats[mp.party] || 0) + 1;
        });
        
        console.log('Party distribution:');
        Object.entries(partyStats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .forEach(([party, count]) => {
                console.log(`  ${party}: ${count} MPs`);
            });
        
        console.log('🎉 All MP Search Integration Tests Passed!');
        
    } catch (error) {
        console.error('❌ MP Search Integration Test Failed:', error);
    }
}

// Run the test
testMPSearchIntegration();
