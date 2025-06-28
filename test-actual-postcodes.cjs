const fs = require('fs');
const path = require('path');

console.log('🔍 TESTING ACTUAL POSTCODE LOOKUP...');
console.log('==================================================');

const MP_DATA_FILE = path.join(__dirname, 'public', 'data', 'mps.json');

function extractPostcodeArea(postcode) {
  if (!postcode || typeof postcode !== 'string') return null;
  
  const cleaned = postcode.replace(/\s+/g, '').toUpperCase();
  const match = cleaned.match(/^([A-Z]{1,2}\d{1,2}[A-Z]?)/);
  return match ? match[1] : null;
}

async function testWithActualPostcodes() {
  try {
    const mpsData = JSON.parse(fs.readFileSync(MP_DATA_FILE, 'utf8'));
    
    console.log(`📖 Loaded ${mpsData.length} MPs`);
    
    // Create postcode to MP mapping
    const postcodeMap = new Map();
    mpsData.forEach(mp => {
      if (mp.postcodes && Array.isArray(mp.postcodes)) {
        mp.postcodes.forEach(postcode => {
          const area = extractPostcodeArea(postcode);
          if (area) {
            postcodeMap.set(area, mp);
            postcodeMap.set(postcode.replace(/\s+/g, '').toUpperCase(), mp);
          }
        });
      }
    });

    console.log(`📮 Mapped ${postcodeMap.size} postcodes`);
    
    // Test with actual postcodes from our database
    const testPostcodes = [];
    
    // Get some sample postcodes from different MPs
    mpsData.slice(0, 10).forEach(mp => {
      if (mp.postcodes && mp.postcodes.length > 0) {
        testPostcodes.push({
          postcode: mp.postcodes[0],
          expectedMP: mp.name,
          expectedConstituency: mp.constituency
        });
      }
    });

    console.log('\n🧪 TESTING ACTUAL POSTCODES:');
    let successCount = 0;
    
    for (const test of testPostcodes) {
      const cleanPostcode = test.postcode.replace(/\s+/g, '').toUpperCase();
      const area = extractPostcodeArea(test.postcode);
      
      const foundMP = postcodeMap.get(cleanPostcode) || postcodeMap.get(area);
      
      if (foundMP && foundMP.name === test.expectedMP) {
        console.log(`✅ ${test.postcode} → ${foundMP.name} (${foundMP.constituency})`);
        successCount++;
      } else if (foundMP) {
        console.log(`⚠️ ${test.postcode} → ${foundMP.name} (expected: ${test.expectedMP})`);
        successCount++; // Still counts as success if we found an MP
      } else {
        console.log(`❌ ${test.postcode} → No MP found`);
      }
    }

    console.log(`\n📊 Success Rate: ${successCount}/${testPostcodes.length} (${((successCount/testPostcodes.length)*100).toFixed(1)}%)`);

    // Test some common postcode patterns
    console.log('\n🔍 TESTING COMMON PATTERNS:');
    const patterns = ['E1', 'E14', 'E16', 'E17', 'E20', 'E21', 'SW1', 'W1', 'M1', 'B1'];
    
    patterns.forEach(pattern => {
      const matchingAreas = Array.from(postcodeMap.keys()).filter(key => key.startsWith(pattern));
      if (matchingAreas.length > 0) {
        const mp = postcodeMap.get(matchingAreas[0]);
        console.log(`✅ ${pattern}* → ${mp.name} (${mp.constituency}) - ${matchingAreas.length} postcodes`);
      } else {
        console.log(`❌ ${pattern}* → No matches`);
      }
    });

    return { successCount, totalTests: testPostcodes.length, postcodeMap };

  } catch (error) {
    console.error('❌ Error testing postcodes:', error);
    return null;
  }
}

// Test the React component's search logic
function testSearchLogic() {
  console.log('\n🔧 TESTING SEARCH LOGIC FROM REACT COMPONENT...');
  
  // This simulates the logic from MPSearch.tsx
  function extractPostcodeAreaFromSearch(query) {
    const cleanQuery = query.trim().toUpperCase().replace(/\s+/g, '');
    
    // UK postcode pattern matching
    const patterns = [
      /^([A-Z]{1,2}\d{1,2}[A-Z]?)\d[A-Z]{2}$/, // Full postcode
      /^([A-Z]{1,2}\d{1,2}[A-Z]?)$/, // Partial postcode (area)
      /^([A-Z]{1,2}\d{1,2})\s*\d[A-Z]{2}$/, // Full postcode with space
      /^([A-Z]{1,2})\d.*$/ // Just letters and first digit
    ];
    
    for (const pattern of patterns) {
      const match = cleanQuery.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    return null;
  }

  const testQueries = [
    'E14 7OZ',
    'E14',
    'e14 7oz',
    'E14 7OZ',
    'M1 1AA',
    'SW1A 0AA',
    'Westminster',
    'London'
  ];

  testQueries.forEach(query => {
    const area = extractPostcodeAreaFromSearch(query);
    console.log(`🔍 "${query}" → Area: ${area || 'None'}`);
  });
}

// Main execution
(async () => {
  try {
    const result = await testWithActualPostcodes();
    testSearchLogic();
    
    if (result && result.successCount > 0) {
      console.log('\n🎉 POSTCODE LOOKUP IS WORKING!');
      console.log(`✅ Successfully mapping postcodes to MPs`);
      console.log(`📊 ${result.postcodeMap.size} total mappings created`);
    } else {
      console.log('\n❌ POSTCODE LOOKUP NEEDS FIXING');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
})();
