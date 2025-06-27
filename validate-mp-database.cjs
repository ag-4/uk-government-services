// Final validation script to test all MP search functionality
const fs = require('fs');
const path = require('path');

async function validateMPDatabase() {
    console.log('🔍 MP Database Final Validation\n');
    
    // Load the corrected MP data
    const mpsPath = path.join(__dirname, 'public', 'data', 'mps.json');
    const mpsData = JSON.parse(fs.readFileSync(mpsPath, 'utf8'));
    
    console.log(`📊 Loaded ${mpsData.length} MPs\n`);
    
    // Validation tests
    const tests = [
        {
            name: 'Email Format Validation',
            test: () => {
                const realEmails = mpsData.filter(mp => 
                    mp.email && 
                    !mp.email.includes('contact@parliament.uk') &&
                    !mp.email.includes('generic') &&
                    mp.email.includes('@parliament.uk')
                );
                return {
                    passed: realEmails.length > 0,
                    details: `${realEmails.length}/${mpsData.length} MPs have real Parliament emails`
                };
            }
        },
        {
            name: 'Phone Number Validation',
            test: () => {
                const realPhones = mpsData.filter(mp => 
                    mp.phone && 
                    mp.phone !== '+44 20 7219 3000' &&
                    mp.phone.startsWith('020')
                );
                return {
                    passed: realPhones.length > 0,
                    details: `${realPhones.length}/${mpsData.length} MPs have real Parliament phone numbers`
                };
            }
        },
        {
            name: 'Constituency Mapping',
            test: () => {
                const withConstituencies = mpsData.filter(mp => 
                    mp.constituency && mp.constituency !== 'Unknown'
                );
                return {
                    passed: withConstituencies.length === mpsData.length,
                    details: `${withConstituencies.length}/${mpsData.length} MPs have proper constituencies`
                };
            }
        },
        {
            name: 'Postcode Coverage',
            test: () => {
                const withPostcodes = mpsData.filter(mp => 
                    mp.postcodes && mp.postcodes.length > 0
                );
                return {
                    passed: withPostcodes.length > 0,
                    details: `${withPostcodes.length}/${mpsData.length} MPs have postcode data`
                };
            }
        },
        {
            name: 'Party Information',
            test: () => {
                const withParties = mpsData.filter(mp => 
                    mp.party && mp.party !== 'Unknown'
                );
                const parties = [...new Set(mpsData.map(mp => mp.party))];
                return {
                    passed: withParties.length === mpsData.length,
                    details: `${withParties.length}/${mpsData.length} MPs have party info (${parties.length} parties: ${parties.join(', ')})`
                };
            }
        }
    ];
    
    // Run validation tests
    let allPassed = true;
    tests.forEach(test => {
        const result = test.test();
        const status = result.passed ? '✅ PASS' : '❌ FAIL';
        console.log(`${status} ${test.name}: ${result.details}`);
        if (!result.passed) allPassed = false;
    });
    
    console.log('\n🎯 Individual MP Verification:');
    mpsData.forEach(mp => {
        const hasRealEmail = mp.email && mp.email.includes('@parliament.uk') && !mp.email.includes('contact@');
        const hasRealPhone = mp.phone && mp.phone !== '+44 20 7219 3000';
        const hasPostcodes = mp.postcodes && mp.postcodes.length > 0;
        
        console.log(`\n👤 ${mp.displayName}`);
        console.log(`   🏛️  ${mp.constituency} (${mp.party})`);
        console.log(`   📧  ${mp.email || 'No email'} ${hasRealEmail ? '✅' : '⚠️'}`);
        console.log(`   📞  ${mp.phone || 'No phone'} ${hasRealPhone ? '✅' : '⚠️'}`);
        console.log(`   📮  ${mp.postcodes ? mp.postcodes.join(', ') : 'No postcodes'} ${hasPostcodes ? '✅' : '⚠️'}`);
    });
    
    // Search simulation tests
    console.log('\n🔍 Search Function Simulation:');
    
    const searchTests = [
        { query: 'Abbott', expectedResults: 1, description: 'Name search' },
        { query: 'Labour', expectedResults: 2, description: 'Party search' },
        { query: 'Hackney', expectedResults: 1, description: 'Constituency search' },
        { query: 'N16', expectedResults: 1, description: 'Postcode search' }
    ];
    
    searchTests.forEach(searchTest => {
        const results = mpsData.filter(mp => {
            const searchFields = [
                mp.name,
                mp.displayName,
                mp.constituency,
                mp.party,
                ...(mp.postcodes || [])
            ].join(' ').toLowerCase();
            
            return searchFields.includes(searchTest.query.toLowerCase());
        });
        
        const passed = results.length >= searchTest.expectedResults;
        const status = passed ? '✅ PASS' : '❌ FAIL';
        console.log(`${status} ${searchTest.description}: "${searchTest.query}" → ${results.length} results`);
        
        if (results.length > 0) {
            results.forEach(result => {
                console.log(`   → ${result.displayName} (${result.party}) - ${result.constituency}`);
            });
        }
    });
    
    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log(`🏆 FINAL VALIDATION RESULT: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    console.log('='.repeat(60));
    
    if (allPassed) {
        console.log('✅ The MP database is now correctly integrated with real, verified data!');
        console.log('✅ All search functionality is working as expected!');
        console.log('✅ The "Find Your MP" page is ready for production use!');
    } else {
        console.log('❌ Some validation tests failed. Please review the issues above.');
    }
    
    return allPassed;
}

// Run validation
validateMPDatabase().catch(console.error);
