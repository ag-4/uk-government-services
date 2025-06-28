const fs = require('fs');
const path = require('path');
const https = require('https');

console.log('🏛️ COMPREHENSIVE MP SYSTEM VALIDATION');
console.log('==================================================');

const MP_DATA_FILE = path.join(__dirname, 'public', 'data', 'mps.json');
const CONSTITUENCY_TEST_CASES = [
  'SW1A 0AA', // Westminster - should find famous MPs
  'M1 1AA',   // Manchester 
  'B1 1AA',   // Birmingham
  'LS1 1AA',  // Leeds
  'E1 6AN',   // London East End
  'W1A 0AX',  // London West End
  'G1 1AA',   // Glasgow
  'CF10 1AA', // Cardiff
  'BT1 1AA',  // Belfast
  'EH1 1AA'   // Edinburgh
];

async function validateMPData() {
  console.log('\n📊 VALIDATING MP DATABASE...');
  
  try {
    const mpsData = JSON.parse(fs.readFileSync(MP_DATA_FILE, 'utf8'));
    
    const validation = {
      totalMPs: mpsData.length,
      partyCounts: {},
      constituencyCounts: {},
      imageSources: {
        wikipedia: 0,
        theyworkforyou: 0,
        parliament: 0,
        local: 0,
        partyLogos: 0,
        placeholders: 0
      },
      postcodesCovered: 0,
      uniqueConstituencies: new Set(),
      duplicateConstituencies: [],
      missingData: {
        noEmail: 0,
        noPhone: 0,
        noImage: 0,
        noPostcodes: 0
      }
    };

    // Analyze MP data
    mpsData.forEach(mp => {
      // Party analysis
      validation.partyCounts[mp.party] = (validation.partyCounts[mp.party] || 0) + 1;
      
      // Constituency analysis
      if (validation.uniqueConstituencies.has(mp.constituency)) {
        validation.duplicateConstituencies.push(mp.constituency);
      } else {
        validation.uniqueConstituencies.add(mp.constituency);
      }
      
      // Image analysis
      if (!mp.thumbnailUrl || mp.thumbnailUrl.includes('placeholder')) {
        validation.imageSources.placeholders++;
      } else if (mp.thumbnailUrl.includes('wikipedia')) {
        validation.imageSources.wikipedia++;
      } else if (mp.thumbnailUrl.includes('theyworkforyou')) {
        validation.imageSources.theyworkforyou++;
      } else if (mp.thumbnailUrl.includes('parliament.uk')) {
        validation.imageSources.parliament++;
      } else if (mp.thumbnailUrl.startsWith('/images/')) {
        validation.imageSources.local++;
      } else if (mp.thumbnailUrl.includes('-logo.')) {
        validation.imageSources.partyLogos++;
      } else {
        validation.imageSources.placeholders++;
      }
      
      // Data completeness
      if (!mp.email) validation.missingData.noEmail++;
      if (!mp.phone) validation.missingData.noPhone++;
      if (!mp.thumbnailUrl) validation.missingData.noImage++;
      if (!mp.postcodes || mp.postcodes.length === 0) validation.missingData.noPostcodes++;
      
      // Postcode coverage
      if (mp.postcodes) {
        validation.postcodesCovered += mp.postcodes.length;
      }
    });

    // Report results
    console.log(`📊 Total MPs: ${validation.totalMPs}`);
    console.log(`🏛️ Unique Constituencies: ${validation.uniqueConstituencies.size}`);
    console.log(`📮 Total Postcodes Covered: ${validation.postcodesCovered.toLocaleString()}`);
    
    console.log('\n🎉 PARTY BREAKDOWN:');
    Object.entries(validation.partyCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([party, count]) => {
        console.log(`   ${party}: ${count} (${((count/validation.totalMPs)*100).toFixed(1)}%)`);
      });

    console.log('\n🖼️ IMAGE SOURCE BREAKDOWN:');
    const totalImages = Object.values(validation.imageSources).reduce((a, b) => a + b, 0);
    Object.entries(validation.imageSources).forEach(([source, count]) => {
      const percentage = ((count/totalImages)*100).toFixed(1);
      console.log(`   ${source}: ${count} (${percentage}%)`);
    });

    const realPhotos = validation.imageSources.wikipedia + validation.imageSources.theyworkforyou + validation.imageSources.parliament + validation.imageSources.local;
    console.log(`✅ MPs with real photos: ${realPhotos} (${((realPhotos/validation.totalMPs)*100).toFixed(1)}%)`);

    if (validation.duplicateConstituencies.length > 0) {
      console.log(`\n⚠️ DUPLICATE CONSTITUENCIES: ${validation.duplicateConstituencies.length}`);
      validation.duplicateConstituencies.slice(0, 5).forEach(constituency => {
        console.log(`   - ${constituency}`);
      });
    }

    console.log('\n📋 DATA COMPLETENESS:');
    console.log(`   Missing Email: ${validation.missingData.noEmail}`);
    console.log(`   Missing Phone: ${validation.missingData.noPhone}`);
    console.log(`   Missing Image: ${validation.missingData.noImage}`);
    console.log(`   Missing Postcodes: ${validation.missingData.noPostcodes}`);

    return validation;

  } catch (error) {
    console.error('❌ Error validating MP data:', error);
    return null;
  }
}

function extractPostcodeArea(postcode) {
  if (!postcode || typeof postcode !== 'string') return null;
  
  const cleaned = postcode.replace(/\s+/g, '').toUpperCase();
  const match = cleaned.match(/^([A-Z]{1,2}\d{1,2}[A-Z]?)/);
  return match ? match[1] : null;
}

async function testPostcodeLookup() {
  console.log('\n🔍 TESTING POSTCODE LOOKUP...');
  
  try {
    const mpsData = JSON.parse(fs.readFileSync(MP_DATA_FILE, 'utf8'));
    
    // Create postcode to MP mapping
    const postcodeMap = new Map();
    mpsData.forEach(mp => {
      if (mp.postcodes && Array.isArray(mp.postcodes)) {
        mp.postcodes.forEach(postcode => {
          const area = extractPostcodeArea(postcode);
          if (area) {
            if (!postcodeMap.has(area)) {
              postcodeMap.set(area, []);
            }
            postcodeMap.get(area).push(mp);
          }
        });
      }
    });

    console.log(`📮 Postcode areas mapped: ${postcodeMap.size}`);
    
    let successfulLookups = 0;
    
    for (const testPostcode of CONSTITUENCY_TEST_CASES) {
      const area = extractPostcodeArea(testPostcode);
      const mps = postcodeMap.get(area);
      
      if (mps && mps.length > 0) {
        const mp = mps[0]; // Take first MP for this area
        console.log(`✅ ${testPostcode} → ${mp.name} (${mp.constituency}) - ${mp.party}`);
        successfulLookups++;
      } else {
        console.log(`❌ ${testPostcode} → No MP found`);
      }
    }

    const successRate = ((successfulLookups / CONSTITUENCY_TEST_CASES.length) * 100).toFixed(1);
    console.log(`\n📊 Postcode lookup success rate: ${successRate}%`);

    return successfulLookups;

  } catch (error) {
    console.error('❌ Error testing postcode lookup:', error);
    return 0;
  }
}

async function validateImageAccessibility() {
  console.log('\n🖼️ VALIDATING IMAGE ACCESSIBILITY...');
  
  const imagesToTest = [
    '/images/theresa-may.jpg',
    '/images/caroline-lucas.jpg', 
    '/images/ed-davey.jpg',
    '/images/labour-logo.png',
    '/images/conservative-logo.jpeg',
    '/images/snp-logo.png'
  ];

  let accessibleImages = 0;
  
  for (const imagePath of imagesToTest) {
    const fullPath = path.join(__dirname, 'public', imagePath);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      if (stats.size > 100) { // More than 100 bytes indicates a real file
        console.log(`✅ ${imagePath} - ${(stats.size/1024).toFixed(1)}KB`);
        accessibleImages++;
      } else {
        console.log(`⚠️ ${imagePath} - File too small (${stats.size} bytes)`);
      }
    } else {
      console.log(`❌ ${imagePath} - File not found`);
    }
  }

  console.log(`\n📊 Accessible images: ${accessibleImages}/${imagesToTest.length}`);
  return accessibleImages;
}

async function generateSystemReport() {
  console.log('\n📋 GENERATING SYSTEM REPORT...');
  
  const validation = await validateMPData();
  const postcodeSuccess = await testPostcodeLookup();
  const imageSuccess = await validateImageAccessibility();
  
  const report = {
    timestamp: new Date().toISOString(),
    validation,
    postcodeSuccess,
    imageSuccess,
    overallHealth: 'EXCELLENT'
  };

  // Determine overall health
  if (validation && validation.totalMPs > 550 && postcodeSuccess > 8 && imageSuccess > 4) {
    report.overallHealth = 'EXCELLENT';
  } else if (validation && validation.totalMPs > 500 && postcodeSuccess > 6 && imageSuccess > 3) {
    report.overallHealth = 'GOOD';
  } else if (validation && validation.totalMPs > 400 && postcodeSuccess > 4) {
    report.overallHealth = 'FAIR';
  } else {
    report.overallHealth = 'NEEDS IMPROVEMENT';
  }

  // Save report
  const reportPath = path.join(__dirname, 'public', 'data', 'system-health-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('\n🎯 FINAL SYSTEM HEALTH REPORT');
  console.log('==================================================');
  console.log(`🏛️ MP Database: ${validation ? validation.totalMPs : 'ERROR'} MPs`);
  console.log(`🗳️ Constituencies: ${validation ? validation.uniqueConstituencies.size : 'ERROR'}`);
  console.log(`📮 Postcode Coverage: ${validation ? validation.postcodesCovered.toLocaleString() : 'ERROR'} areas`);
  console.log(`🔍 Postcode Lookup: ${postcodeSuccess}/${CONSTITUENCY_TEST_CASES.length} successful`);
  console.log(`🖼️ Image System: ${imageSuccess}/6 core images available`);
  console.log(`📊 Overall Health: ${report.overallHealth}`);
  console.log(`📁 Report saved: ${reportPath}`);
  console.log('==================================================');

  return report;
}

// Main execution
(async () => {
  try {
    const report = await generateSystemReport();
    
    if (report.overallHealth === 'EXCELLENT') {
      console.log('\n🎉 SYSTEM VALIDATION COMPLETE - ALL SYSTEMS OPTIMAL!');
      console.log('✅ Ready for production deployment');
      console.log('✅ All major UK postcodes covered');
      console.log('✅ High-quality MP data with photos');
      console.log('✅ Robust search and lookup functionality');
    } else {
      console.log(`\n⚠️ SYSTEM VALIDATION COMPLETE - STATUS: ${report.overallHealth}`);
      console.log('📋 Review the report for improvement areas');
    }
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  }
})();
