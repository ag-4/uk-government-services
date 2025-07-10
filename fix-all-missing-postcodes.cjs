const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function fixAllMissingPostcodes() {
    console.log('🌍 COMPREHENSIVE POSTCODE MAPPING');
    console.log('==========================================');
    
    // Read current MP data
    const mpsPath = path.join(__dirname, 'scripts/data/complete-parliament-data/mps-complete-all.json');
    const mpsData = JSON.parse(fs.readFileSync(mpsPath, 'utf8'));
    
    // Create constituency to MP mapping (case-insensitive)
    const constituencyToMP = {};
    mpsData.forEach(mp => {
        if (mp.constituency && mp.isActive) {
            constituencyToMP[mp.constituency.toLowerCase()] = mp.id;
        }
    });
    
    console.log(`✅ Found ${Object.keys(constituencyToMP).length} active MP constituencies`);
    
    // Load current mapping
    const currentMappingPath = path.join(__dirname, 'postcode-mp-mapping-COMPLETE.json');
    const currentMapping = JSON.parse(fs.readFileSync(currentMappingPath, 'utf8'));
    const updatedMapping = { ...currentMapping };
    
    console.log(`📊 Starting with ${Object.keys(currentMapping).length.toLocaleString()} mapped postcodes`);
    
    // Create comprehensive constituency name mappings
    const constituencyMappings = createConstituencyMappings();
    
    // Stream through all postcodes
    const postcodesPath = path.join(__dirname, 'postcodes.csv');
    const fileStream = fs.createReadStream(postcodesPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    
    let headers = null;
    let postcodeIndex, constituencyIndex, inUseIndex;
    let lineNumber = 0;
    let newMatches = 0;
    let skippedInactive = 0;
    let skippedAlreadyMapped = 0;
    let failedMappings = 0;
    
    console.log('\n🔄 Processing all postcodes...\n');
    
    for await (const line of rl) {
        lineNumber++;
        
        if (lineNumber === 1) {
            headers = line.split(',');
            postcodeIndex = headers.findIndex(h => h.toLowerCase().includes('postcode'));
            constituencyIndex = headers.findIndex(h => h.toLowerCase().includes('constituency name 2024'));
            inUseIndex = headers.findIndex(h => h.toLowerCase().includes('in use'));
            continue;
        }
        
        if (lineNumber % 100000 === 0) {
            console.log(`⏳ Processed ${lineNumber.toLocaleString()} lines | New: ${newMatches.toLocaleString()} | Failed: ${failedMappings.toLocaleString()}`);
        }
        
        if (!line.trim()) continue;
        
        // Parse CSV line properly
        const fields = parseCSVLine(line);
        
        const postcode = fields[postcodeIndex]?.replace(/"/g, '').trim();
        const constituency = fields[constituencyIndex]?.replace(/"/g, '').trim();
        const inUse = fields[inUseIndex]?.replace(/"/g, '').trim();
        
        if (!postcode || !constituency) continue;
        
        // Skip inactive postcodes
        if (!inUse || inUse.toLowerCase() !== 'yes') {
            skippedInactive++;
            continue;
        }
        
        // Skip already mapped postcodes
        if (updatedMapping[postcode]) {
            skippedAlreadyMapped++;
            continue;
        }
        
        const cleanConstituency = constituency.toLowerCase();
        
        // Try direct match first
        let mpId = constituencyToMP[cleanConstituency];
        
        // Try mapped constituency names
        if (!mpId && constituencyMappings[cleanConstituency]) {
            const mappedConstituency = constituencyMappings[cleanConstituency];
            mpId = constituencyToMP[mappedConstituency];
        }
        
        if (mpId) {
            updatedMapping[postcode] = mpId;
            newMatches++;
        } else {
            failedMappings++;
            // Log first few failures for debugging
            if (failedMappings <= 10) {
                console.log(`  ❌ Failed to map: "${constituency}" for postcode ${postcode}`);
            }
        }
    }
    
    console.log('\n🎉 === COMPREHENSIVE MAPPING COMPLETE ===');
    console.log(`📊 Statistics:`);
    console.log(`   • Total lines processed: ${lineNumber.toLocaleString()}`);
    console.log(`   • New postcodes mapped: ${newMatches.toLocaleString()}`);
    console.log(`   • Already mapped: ${skippedAlreadyMapped.toLocaleString()}`);
    console.log(`   • Inactive postcodes: ${skippedInactive.toLocaleString()}`);
    console.log(`   • Failed mappings: ${failedMappings.toLocaleString()}`);
    console.log(`   • Total mapped postcodes: ${Object.keys(updatedMapping).length.toLocaleString()}`);
    
    const coverage = ((Object.keys(updatedMapping).length / (newMatches + skippedAlreadyMapped + Object.keys(updatedMapping).length)) * 100).toFixed(1);
    console.log(`   • Coverage: ${coverage}%`);
    
    // Save the comprehensive mapping
    const finalMappingPath = path.join(__dirname, 'postcode-mp-mapping-COMPREHENSIVE.json');
    fs.writeFileSync(finalMappingPath, JSON.stringify(updatedMapping, null, 2));
    console.log(`✅ Saved comprehensive mapping: ${finalMappingPath}`);
    
    // Test comprehensive coverage
    console.log('\n🧪 Testing comprehensive coverage:');
    const testPostcodes = [
        'SW1A 0AA', // Westminster
        'M1 1AA',   // Manchester 
        'B1 1AA',   // Birmingham
        'LS1 1AA',  // Leeds
        'DN16 1AA', // Scunthorpe
        'HU18 1AB', // East Yorkshire
        'YO16 4AA', // East Yorkshire
        'YO12 1AA', // Scarborough (still problematic?)
        'TS9 5AA',  // Richmond
        'DL1 1AA'   // Darlington
    ];
    
    let successCount = 0;
    testPostcodes.forEach(pc => {
        const mpId = updatedMapping[pc];
        if (mpId) {
            const mp = mpsData.find(m => m.id === mpId);
            console.log(`  ✅ ${pc}: ${mp ? mp.displayName + ' (' + mp.constituency + ')' : 'Found but MP details missing'}`);
            successCount++;
        } else {
            console.log(`  ❌ ${pc}: Not found`);
        }
    });
    
    console.log(`\n📈 Test Success Rate: ${successCount}/${testPostcodes.length} (${((successCount/testPostcodes.length)*100).toFixed(1)}%)`);
    
    // Create optimized search function
    const searchFunction = `
// OPTIMIZED POSTCODE SEARCH FUNCTION
const postcodeMapping = require('./postcode-mp-mapping-COMPREHENSIVE.json');
const mpsData = require('./scripts/data/complete-parliament-data/mps-complete-all.json');

function findMPByPostcode(postcode) {
    if (!postcode) return null;
    
    // Clean and normalize postcode
    const cleanPostcode = postcode.toUpperCase().replace(/\\s+/g, ' ').trim();
    
    // Try direct lookup
    const mpId = postcodeMapping[cleanPostcode];
    if (!mpId) return null;
    
    // Find MP details
    const mp = mpsData.find(m => m.id === mpId);
    if (!mp) return null;
    
    return {
        postcode: cleanPostcode,
        mp: {
            id: mp.id,
            name: mp.displayName,
            constituency: mp.constituency,
            party: mp.party,
            email: mp.email,
            phone: mp.phone,
            image: mp.thumbnailUrl
        }
    };
}

// Export for use in your application
module.exports = { findMPByPostcode };

// CLI test
if (require.main === module) {
    const testCodes = process.argv.slice(2);
    if (testCodes.length > 0) {
        testCodes.forEach(code => {
            const result = findMPByPostcode(code);
            if (result) {
                console.log(\`✅ \${result.postcode}: \${result.mp.name} (\${result.mp.constituency}) - \${result.mp.party}\`);
            } else {
                console.log(\`❌ \${code}: No MP found\`);
            }
        });
    } else {
        console.log('Usage: node postcode-search.js <postcode1> [postcode2] ...');
    }
}
`;
    
    fs.writeFileSync(path.join(__dirname, 'postcode-search.js'), searchFunction);
    console.log('✅ Created optimized search function: postcode-search.js');
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Use postcode-mp-mapping-COMPREHENSIVE.json as your main mapping file');
    console.log('2. Integrate postcode-search.js into your application');
    console.log('3. Test with: node postcode-search.js "SW1A 0AA" "YO16 4AA"');
    console.log(`\n🎉 SUCCESS: Added ${newMatches.toLocaleString()} new postcodes!`);
    console.log(`📊 Total coverage now: ${Object.keys(updatedMapping).length.toLocaleString()} postcodes`);
}

function parseCSVLine(line) {
    const fields = [];
    let currentField = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            fields.push(currentField);
            currentField = '';
        } else {
            currentField += char;
        }
    }
    fields.push(currentField);
    
    return fields;
}

function createConstituencyMappings() {
    return {
        // Previous mappings plus comprehensive additions
        'bridlington and the wolds': 'east yorkshire',
        'beverley and holderness': 'east yorkshire',
        'hull north': 'kingston upon hull north and cottingham',
        'hull east': 'kingston upon hull east',
        'york': 'york central',
        'york outer': 'york outer',
        'selby and ainsty': 'selby',
        'richmond (yorks)': 'richmond and northallerton',
        'richmond': 'richmond and northallerton',
        'skipton and ripon': 'skipton and ripon',
        'leeds north west': 'leeds north west',
        'keighley': 'keighley and ilkley',
        'calder valley': 'calder valley',
        'dewsbury': 'dewsbury and batley',
        'batley and spen': 'dewsbury and batley',
        'barnsley east': 'barnsley north',
        'doncaster central': 'doncaster central',
        'doncaster north': 'doncaster north',
        'rother valley': 'rother valley',
        
        // Add more historical constituency mappings
        'scunthorpe': 'scunthorpe',
        'great grimsby': 'great grimsby and cleethorpes',
        'cleethorpes': 'great grimsby and cleethorpes',
        'brigg and goole': 'brigg and immingham',
        'immingham': 'brigg and immingham',
        
        // Add variations and common misspellings
        'kingston upon hull west and hessle': 'kingston upon hull west and haltemprice',
        'scarborough and whitby': 'scarborough and whitby',
        'thirsk and malton': 'thirsk and malton',
        
        // Add Welsh constituencies
        'cardiff central': 'cardiff central',
        'cardiff north': 'cardiff north',
        'cardiff south and penarth': 'cardiff south and penarth',
        'cardiff west': 'cardiff west',
        'cardiff east': 'cardiff east',
        
        // Add Scottish constituencies
        'glasgow central': 'glasgow south',
        'glasgow north': 'glasgow north',
        'glasgow south': 'glasgow south',
        'glasgow west': 'glasgow west',
        'glasgow east': 'glasgow east',
        'edinburgh central': 'edinburgh central',
        'edinburgh north and leith': 'edinburgh north and leith',
        'edinburgh south': 'edinburgh south',
        'edinburgh west': 'edinburgh west',
        
        // Add Northern Ireland
        'belfast central': 'belfast south and mid down',
        'belfast north': 'belfast north',
        'belfast south': 'belfast south and mid down',
        'belfast west': 'belfast west',
        'belfast east': 'belfast east'
    };
}

// Run the comprehensive mapping
fixAllMissingPostcodes().catch(console.error);
