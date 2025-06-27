const fs = require('fs');
const path = require('path');

async function fixDuplicateConstituencies() {
    console.log('🔍 Starting duplicate constituency analysis and fix...');
    
    const inputFile = path.join(__dirname, 'public', 'data', 'mps.json');
    const outputFile = path.join(__dirname, 'public', 'data', 'mps-fixed.json');
    const backupFile = path.join(__dirname, 'public', 'data', 'mps-before-dedup.json');
    
    try {
        // Read the current MP data
        console.log('📖 Reading MP data...');
        const rawData = fs.readFileSync(inputFile, 'utf8');
        const mps = JSON.parse(rawData);
        
        console.log(`📊 Total MPs loaded: ${mps.length}`);
        
        // Create backup
        console.log('💾 Creating backup...');
        fs.writeFileSync(backupFile, rawData);
        
        // Analyze constituencies
        const constituencyMap = new Map();
        const duplicates = [];
        
        mps.forEach((mp, index) => {
            const constituency = mp.constituency;
            if (constituencyMap.has(constituency)) {
                // Found duplicate
                const existing = constituencyMap.get(constituency);
                duplicates.push({
                    constituency,
                    existing: existing,
                    duplicate: { mp, index }
                });
            } else {
                constituencyMap.set(constituency, { mp, index });
            }
        });
        
        console.log(`🔍 Found ${duplicates.length} duplicate constituencies:`);
        duplicates.forEach(dup => {
            console.log(`  - ${dup.constituency}: ${dup.existing.mp.name} vs ${dup.duplicate.mp.name}`);
        });
        
        // Fix duplicates by keeping the first occurrence and removing others
        const indicesToRemove = new Set();
        duplicates.forEach(dup => {
            indicesToRemove.add(dup.duplicate.index);
        });
        
        console.log(`🗑️ Removing ${indicesToRemove.size} duplicate MPs...`);
        
        // Create new array without duplicates
        const fixedMPs = mps.filter((mp, index) => !indicesToRemove.has(index));
        
        console.log(`✅ Fixed MPs count: ${fixedMPs.length}`);
        
        // Verify no duplicates remain
        const verifyConstituencies = new Set();
        const stillDuplicates = [];
        
        fixedMPs.forEach(mp => {
            if (verifyConstituencies.has(mp.constituency)) {
                stillDuplicates.push(mp.constituency);
            } else {
                verifyConstituencies.add(mp.constituency);
            }
        });
        
        if (stillDuplicates.length > 0) {
            console.log(`⚠️ Warning: Still found ${stillDuplicates.length} duplicates after fix`);
            stillDuplicates.forEach(constituency => console.log(`  - ${constituency}`));
        } else {
            console.log('✅ No duplicate constituencies remaining');
        }
        
        // Count postcodes
        const totalPostcodes = fixedMPs.reduce((sum, mp) => sum + (mp.postcodes?.length || 0), 0);
        console.log(`📮 Total postcodes: ${totalPostcodes.toLocaleString()}`);
        console.log(`📊 Average postcodes per MP: ${Math.round(totalPostcodes / fixedMPs.length)}`);
        
        // Party breakdown
        const partyCount = {};
        fixedMPs.forEach(mp => {
            partyCount[mp.party] = (partyCount[mp.party] || 0) + 1;
        });
        
        console.log('\n🎭 Party breakdown:');
        Object.entries(partyCount)
            .sort(([,a], [,b]) => b - a)
            .forEach(([party, count]) => {
                console.log(`  ${party}: ${count} MPs`);
            });
        
        // Save fixed data
        console.log('\n💾 Saving fixed MP data...');
        fs.writeFileSync(outputFile, JSON.stringify(fixedMPs, null, 2));
        
        console.log(`✅ Fixed MP data saved to: ${outputFile}`);
        console.log(`💾 Backup saved to: ${backupFile}`);
        
        // Ask user if they want to replace the original file
        console.log('\n🔄 To apply the fix to your main MP data, run:');
        console.log(`copy "${outputFile}" "${inputFile}"`);
        
        return {
            originalCount: mps.length,
            fixedCount: fixedMPs.length,
            duplicatesRemoved: duplicates.length,
            totalPostcodes,
            parties: partyCount
        };
        
    } catch (error) {
        console.error('❌ Error fixing duplicate constituencies:', error);
        throw error;
    }
}

// Run the fix
fixDuplicateConstituencies()
    .then(result => {
        console.log('\n🎉 Duplicate constituency fix completed successfully!');
        console.log(`   Original: ${result.originalCount} MPs`);
        console.log(`   Fixed: ${result.fixedCount} MPs`);
        console.log(`   Removed: ${result.duplicatesRemoved} duplicates`);
    })
    .catch(error => {
        console.error('💥 Fix failed:', error);
        process.exit(1);
    });
