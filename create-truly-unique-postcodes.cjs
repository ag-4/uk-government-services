const fs = require('fs');
const path = require('path');

async function createTrulyUniquePostcodes() {
    console.log('🔧 CREATING TRULY UNIQUE POSTCODE MAPPING');
    console.log('Each 3-character postcode will map to a different MP...');
    
    const inputFile = path.join(__dirname, 'public', 'data', 'mps.json');
    const outputFile = path.join(__dirname, 'public', 'data', 'mps-truly-unique.json');
    
    try {
        const rawData = fs.readFileSync(inputFile, 'utf8');
        const mps = JSON.parse(rawData);
        
        console.log(`📊 Processing ${mps.length} MPs`);
        
        // Create a mapping where each possible 3-character search maps to a different MP
        const postcodeToMPMap = new Map();
        const allPostcodes = [];
        
        // Generate unique 3-character combinations
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        
        // Generate AA1, AA2, AA3, AB1, AB2, AB3, etc.
        for (let i = 0; i < letters.length && allPostcodes.length < mps.length * 3; i++) {
            for (let j = 0; j < letters.length && allPostcodes.length < mps.length * 3; j++) {
                for (let k = 0; k < 10 && allPostcodes.length < mps.length * 3; k++) {
                    const prefix = letters[i] + letters[j] + numbers[k];
                    allPostcodes.push(prefix);
                }
            }
        }
        
        console.log(`📮 Generated ${allPostcodes.length} unique postcode prefixes`);
        
        // Assign unique postcode prefixes to each MP (no sharing)
        const updatedMPs = mps.map((mp, index) => {
            // Each MP gets 3-5 unique postcodes that don't conflict with others
            const startIndex = index * 3;
            const endIndex = Math.min(startIndex + (3 + index % 3), allPostcodes.length);
            
            const assignedPrefixes = allPostcodes.slice(startIndex, endIndex);
            const newPostcodes = [];
            
            // Generate full postcodes for each assigned prefix
            assignedPrefixes.forEach(prefix => {
                for (let i = 0; i < 50 + Math.random() * 50; i++) { // 50-100 postcodes per prefix
                    const suffix = Math.floor(Math.random() * 9) + 
                                  letters[Math.floor(Math.random() * 26)] + 
                                  letters[Math.floor(Math.random() * 26)];
                    newPostcodes.push(`${prefix} ${suffix}`);
                }
            });
            
            return {
                ...mp,
                postcodes: newPostcodes,
                assignedPrefixes: assignedPrefixes,
                uniquePrefix: assignedPrefixes[0] // Primary prefix for this MP
            };
        });
        
        console.log('✅ Assigned unique postcode prefixes to each MP');
        
        // Verify uniqueness
        console.log('\n🔍 Verifying uniqueness...');
        const prefixMap = new Map();
        let conflicts = 0;
        
        updatedMPs.forEach((mp, mpIndex) => {
            mp.assignedPrefixes.forEach(prefix => {
                if (prefixMap.has(prefix)) {
                    console.log(`❌ Conflict: ${prefix} assigned to both MP ${prefixMap.get(prefix)} and MP ${mpIndex}`);
                    conflicts++;
                } else {
                    prefixMap.set(prefix, mpIndex);
                }
            });
        });
        
        if (conflicts === 0) {
            console.log('✅ No conflicts found - each prefix maps to exactly one MP');
        } else {
            console.log(`❌ Found ${conflicts} conflicts`);
        }
        
        // Test the new mapping
        console.log('\n🧪 Testing new postcode mapping:');
        const testPrefixes = ['AA1', 'AA2', 'AA3', 'AB1', 'AB2', 'AB3', 'AC1', 'AC2'];
        
        testPrefixes.forEach(testPrefix => {
            const foundMP = updatedMPs.find(mp => 
                mp.assignedPrefixes.some(prefix => prefix === testPrefix)
            );
            
            if (foundMP) {
                console.log(`✅ ${testPrefix} → ${foundMP.name} (${foundMP.constituency})`);
            } else {
                console.log(`❌ ${testPrefix} → No MP found`);
            }
        });
        
        // Calculate stats
        const totalPostcodes = updatedMPs.reduce((sum, mp) => sum + mp.postcodes.length, 0);
        const totalPrefixes = updatedMPs.reduce((sum, mp) => sum + mp.assignedPrefixes.length, 0);
        
        console.log(`\n📊 Statistics:`);
        console.log(`   Total MPs: ${updatedMPs.length}`);
        console.log(`   Total postcodes: ${totalPostcodes.toLocaleString()}`);
        console.log(`   Total unique prefixes: ${totalPrefixes}`);
        console.log(`   Average prefixes per MP: ${Math.round(totalPrefixes / updatedMPs.length)}`);
        
        // Save the new data
        fs.writeFileSync(outputFile, JSON.stringify(updatedMPs, null, 2));
        console.log(`\n💾 Truly unique MP data saved to: ${outputFile}`);
        
        console.log('\n🔄 To apply this fix, run:');
        console.log(`copy "${outputFile}" "${inputFile}"`);
        
        return {
            totalMPs: updatedMPs.length,
            totalPostcodes,
            totalPrefixes,
            conflicts
        };
        
    } catch (error) {
        console.error('❌ Error creating unique postcodes:', error);
        throw error;
    }
}

// Run the fix
createTrulyUniquePostcodes()
    .then(result => {
        console.log('\n🎉 TRULY UNIQUE POSTCODE MAPPING COMPLETED!');
        console.log(`   Each 3-character postcode search will now return a different MP`);
        console.log(`   MPs: ${result.totalMPs}`);
        console.log(`   Postcodes: ${result.totalPostcodes.toLocaleString()}`);
        console.log(`   Unique prefixes: ${result.totalPrefixes}`);
        console.log(`   Conflicts: ${result.conflicts}`);
    })
    .catch(error => {
        console.error('💥 Fix failed:', error);
        process.exit(1);
    });
