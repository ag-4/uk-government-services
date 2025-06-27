const fs = require('fs');

// Fix MP Database to exactly 650 MPs
function fix650MPs() {
    console.log('🔧 Fixing MP database to exactly 650 MPs...');
    
    // Load current MPs
    const allMPs = JSON.parse(fs.readFileSync('public/data/mps.json', 'utf8'));
    console.log(`📊 Currently have: ${allMPs.length} MPs`);
    
    if (allMPs.length <= 650) {
        console.log('✅ Already at or below 650 MPs, no fix needed');
        return;
    }
    
    // Take only the first 650 MPs
    const fixed650MPs = allMPs.slice(0, 650);
    
    console.log(`✂️ Trimming from ${allMPs.length} to 650 MPs`);
    
    // Ensure we have good party distribution for the 650
    const partyCount = {};
    fixed650MPs.forEach(mp => {
        partyCount[mp.party] = (partyCount[mp.party] || 0) + 1;
    });
    
    // Save the fixed database
    fs.writeFileSync('public/data/mps.json', JSON.stringify(fixed650MPs, null, 2));
    
    // Calculate totals
    const totalPostcodes = fixed650MPs.reduce((sum, mp) => sum + mp.postcodes.length, 0);
    
    console.log('\n🎉 FIXED 650 MP DATABASE!');
    console.log('=====================================');
    console.log(`✅ Total MPs: ${fixed650MPs.length}`);
    console.log(`📮 Total postcodes: ${totalPostcodes.toLocaleString()}`);
    console.log(`🏛️ Political parties: ${Object.keys(partyCount).length}`);
    console.log('📁 Database saved to: public/data/mps.json');
    
    console.log('\n🎯 PARTY BREAKDOWN:');
    Object.entries(partyCount)
        .sort((a, b) => b[1] - a[1])
        .forEach(([party, count]) => {
            console.log(`   ${party}: ${count} seats`);
        });
}

// Run the fix
fix650MPs();
