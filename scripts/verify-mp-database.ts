import * as fs from 'fs';
import * as path from 'path';

interface ProcessedMP {
  id: string;
  parliamentId: number;
  name: string;
  displayName: string;
  fullTitle: string;
  constituency: string;
  constituencyId: number;
  party: string;
  partyAbbreviation: string;
  partyColor: string;
  gender: string;
  membershipStartDate: string;
  isActive: boolean;
  email?: string;
  phone?: string;
  website?: string;
  addresses: Array<{
    type: string;
    fullAddress: string;
    postcode?: string;
    line1?: string;
    line2?: string;
    town?: string;
    county?: string;
    country?: string;
  }>;
  thumbnailUrl: string;
  postcodes: string[];
  constituencyPostcodes: string[];
}

function verifyMPDatabase() {
  console.log('🔍 MP Database Verification');
  console.log('='.repeat(50));

  // Step 1: Load the MP database file
  const dataPath = path.join(process.cwd(), 'public', 'data', 'mps.json');

  if (!fs.existsSync(dataPath)) {
    console.error(`❌ ERROR: Database file not found at ${dataPath}`);
    console.log('Please run the update-mp-database.ts script first.');
    process.exit(1);
  }

  const mpsData: ProcessedMP[] = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log(`📊 Loaded ${mpsData.length} MPs from database`);

  // Step 2: Basic data validation
  console.log('\n🔎 Checking basic data integrity...');

  // Count MPs with various attributes
  const withConstituency = mpsData.filter(mp => mp.constituency && mp.constituency.trim() !== '').length;
  const withParty = mpsData.filter(mp => mp.party && mp.party.trim() !== '').length;
  const withEmail = mpsData.filter(mp => mp.email && mp.email.includes('@')).length;
  const withPhone = mpsData.filter(mp => mp.phone && mp.phone.trim() !== '').length;
  const withThumbnail = mpsData.filter(mp => mp.thumbnailUrl && mp.thumbnailUrl.includes('http')).length;
  const withPostcodes = mpsData.filter(mp => mp.postcodes && mp.postcodes.length > 0).length;

  // Party distribution
  const parties = mpsData.reduce((acc, mp) => {
    acc[mp.party] = (acc[mp.party] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Gender distribution
  const genders = mpsData.reduce((acc, mp) => {
    acc[mp.gender] = (acc[mp.gender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Postcode statistics
  const totalPostcodes = mpsData.reduce((sum, mp) => sum + mp.postcodes.length, 0);
  const avgPostcodesPerMP = totalPostcodes / mpsData.length;

  // Display validation results
  console.log(`✅ MPs with constituency: ${withConstituency}/${mpsData.length} (${(withConstituency/mpsData.length*100).toFixed(1)}%)`);
  console.log(`✅ MPs with party: ${withParty}/${mpsData.length} (${(withParty/mpsData.length*100).toFixed(1)}%)`);
  console.log(`✅ MPs with email: ${withEmail}/${mpsData.length} (${(withEmail/mpsData.length*100).toFixed(1)}%)`);
  console.log(`✅ MPs with phone: ${withPhone}/${mpsData.length} (${(withPhone/mpsData.length*100).toFixed(1)}%)`);
  console.log(`✅ MPs with thumbnail: ${withThumbnail}/${mpsData.length} (${(withThumbnail/mpsData.length*100).toFixed(1)}%)`);
  console.log(`✅ MPs with postcodes: ${withPostcodes}/${mpsData.length} (${(withPostcodes/mpsData.length*100).toFixed(1)}%)`);

  console.log('\n📊 Party Distribution:');
  Object.entries(parties).sort((a, b) => b[1] - a[1]).forEach(([party, count]) => {
    console.log(`   ${party}: ${count} MPs (${(count/mpsData.length*100).toFixed(1)}%)`);
  });

  console.log('\n👫 Gender Distribution:');
  Object.entries(genders).forEach(([gender, count]) => {
    console.log(`   ${gender}: ${count} MPs (${(count/mpsData.length*100).toFixed(1)}%)`);
  });

  console.log('\n📮 Postcode Coverage:');
  console.log(`   Total postcodes: ${totalPostcodes}`);
  console.log(`   Average postcodes per MP: ${avgPostcodesPerMP.toFixed(1)}`);

  // Step 3: Search functionality testing
  console.log('\n🔍 Testing search functionality...');

  const searchTests = [
    { type: 'Postcode', query: 'SW1A', expectResults: true },
    { type: 'Name', query: 'Smith', expectResults: true },
    { type: 'Constituency', query: 'Manchester', expectResults: true },
    { type: 'Party', query: 'Labour', expectResults: true },
    { type: 'Party', query: 'Conservative', expectResults: true },
  ];

  searchTests.forEach(test => {
    const results = mpsData.filter(mp => {
      const searchableText = [
        mp.name,
        mp.displayName,
        mp.constituency,
        mp.party,
        ...(mp.postcodes || [])
      ].join(' ').toLowerCase();

      return searchableText.includes(test.query.toLowerCase());
    });

    const passed = test.expectResults ? results.length > 0 : results.length === 0;
    console.log(`${passed ? '✅' : '❌'} ${test.type} search "${test.query}": ${results.length} results`);

    if (results.length > 0 && results.length <= 3) {
      results.forEach(r => console.log(`   → ${r.displayName} (${r.party}) - ${r.constituency}`));
    }
  });

  // Step 4: Overall assessment
  console.log('\n🏁 Overall Database Assessment:');

  const requiredFields = [
    { name: 'Constituency data', threshold: 0.99, value: withConstituency / mpsData.length },
    { name: 'Party data', threshold: 0.99, value: withParty / mpsData.length },
    { name: 'Postcode coverage', threshold: 0.95, value: withPostcodes / mpsData.length },
    { name: 'Thumbnail images', threshold: 0.90, value: withThumbnail / mpsData.length },
  ];

  let allPassed = true;

  requiredFields.forEach(field => {
    const passed = field.value >= field.threshold;
    if (!passed) allPassed = false;

    console.log(`${passed ? '✅' : '❌'} ${field.name}: ${(field.value * 100).toFixed(1)}% (threshold: ${(field.threshold * 100).toFixed(1)}%)`);
  });

  console.log('\n' + '='.repeat(50));
  console.log(`📝 VERIFICATION RESULT: ${allPassed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log('='.repeat(50));

  if (allPassed) {
    console.log('✅ The MP database is ready for production use!');
  } else {
    console.log('❌ Some issues were detected with the MP database.');
    console.log('   Please review the verification results and update the database as needed.');
  }

  return allPassed;
}

// Execute the verification
verifyMPDatabase();
