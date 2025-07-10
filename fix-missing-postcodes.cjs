const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Comprehensive mapping including the missing ones
const additionalConstituencyMappings = {
    // Yorkshire area missing mappings
    'bridlington and the wolds': 'east yorkshire',
    'beverley and holderness': 'east yorkshire', 
    'hull north': 'kingston upon hull north and cottingham',
    'hull east': 'kingston upon hull east',
    'hull west and hessle': 'kingston upon hull west and haltemprice',
    'haltemprice and howden': 'kingston upon hull west and haltemprice',
    'york': 'york central',
    'york outer': 'york outer',
    'selby and ainsty': 'selby',
    'ryedale': 'thirsk and malton',
    'thirsk and malton': 'thirsk and malton',
    'scarborough and whitby': 'scarborough and whitby',
    'richmond (yorks)': 'richmond and northallerton',
    'richmond': 'richmond and northallerton',
    'skipton and ripon': 'skipton and ripon',
    'harrogate and knaresborough': 'harrogate and knaresborough',
    
    // Lincolnshire area
    'scunthorpe': 'scunthorpe',
    'brigg and goole': 'brigg and immingham',
    'cleethorpes': 'great grimsby and cleethorpes',
    'great grimsby': 'great grimsby and cleethorpes',
    'louth and horncastle': 'louth and horncastle',
    'gainsborough': 'gainsborough',
    'lincoln': 'lincoln',
    'sleaford and north hykeham': 'sleaford and north hykeham',
    'grantham and stamford': 'grantham and bourne',
    'south holland and the deepings': 'south holland and the deepings',
    'boston and skegness': 'boston and skegness',
    
    // Teesside area (TS postcodes)
    'middlesbrough': 'middlesbrough and thornaby east',
    'middlesbrough south and east cleveland': 'middlesbrough south and east cleveland',
    'redcar': 'redcar and cleveland',
    'stockton south': 'stockton west',
    'stockton north': 'stockton west',
    'hartlepool': 'hartlepool',
    
    // County Durham (DL postcodes)
    'darlington': 'darlington',
    'sedgefield': 'newton aycliffe and spennymoor',
    'bishop auckland': 'bishop auckland',
    'north west durham': 'north west durham',
    'north durham': 'north durham',
    'city of durham': 'city of durham',
    'easington': 'easington',
    'jarrow': 'jarrow and gateshead east',
    'south shields': 'south shields',
    'sunderland central': 'sunderland central',
    'washington and sunderland west': 'washington and gateshead south',
    
    // Add more mappings for other missing areas
    'gordon': 'gordon and buchan',
    'moray': 'aberdeenshire north and moray east',
    'angus': 'angus and perthshire glens',
    'perth and north perthshire': 'perth and kinross-shire',
    
    // Birmingham area
    'birmingham, ladywood': 'birmingham ladywood',
    'birmingham, yardley': 'birmingham yardley',
    'birmingham, selly oak': 'birmingham selly oak',
    'birmingham, edgbaston': 'birmingham edgbaston',
    'birmingham, perry barr': 'birmingham perry barr',
    'birmingham, erdington': 'birmingham erdington',
    
    // More English constituencies
    'st albans': 'st albans',
    'welwyn hatfield': 'welwyn hatfield',
    'stevenage': 'stevenage',
    'hitchin and harpenden': 'hitchin',
    'north east hertfordshire': 'north east hertfordshire',
    'hertford and stortford': 'hertford and stortford',
    'broxbourne': 'broxbourne',
    'hertsmere': 'hertsmere',
    'watford': 'watford',
    'south west hertfordshire': 'south west hertfordshire',
    
    // Add many more...
    'luton north': 'luton north',
    'luton south': 'luton south and south bedfordshire',
    'mid bedfordshire': 'mid bedfordshire',
    'south west bedfordshire': 'south west bedfordshire',
    'bedford': 'bedford',
    'north east bedfordshire': 'north east bedfordshire',
    
    // London areas that might be missing
    'cities of london and westminster': 'cities of london and westminster',
    'westminster north': 'westminster north',
    'regent\'s park and kensington north': 'regent\'s park and kensington north',
    'kensington': 'kensington and bayswater',
    'chelsea and fulham': 'chelsea and fulham',
    
    // Add fallbacks for partial name matches
};

async function fixMissingPostcodes() {
    console.log('🔧 Fixing missing postcode mappings...');
    
    // Read current MP data
    const mpsPath = path.join(__dirname, 'scripts/data/complete-parliament-data/mps-complete-all.json');
    const mpsData = JSON.parse(fs.readFileSync(mpsPath, 'utf8'));
    
    // Create constituency to MP mapping including the additional mappings
    const constituencyToMP = {};
    mpsData.forEach(mp => {
        if (mp.constituency && mp.isActive) {
            constituencyToMP[mp.constituency.toLowerCase()] = mp.id;
        }
    });
    
    console.log(`✅ Found ${Object.keys(constituencyToMP).length} MP constituencies`);
    
    // Read the current mapping to see what we're missing
    const currentMappingPath = path.join(__dirname, 'scripts/data/complete-parliament-data/postcode-mp-mapping-final.json');
    const currentMapping = JSON.parse(fs.readFileSync(currentMappingPath, 'utf8'));
    const currentPostcodes = new Set(Object.keys(currentMapping));
    
    console.log(`📊 Current mapping has ${currentPostcodes.size.toLocaleString()} postcodes`);
    
    // Stream through postcodes.csv again to find ALL postcodes
    const postcodesPath = path.join(__dirname, 'postcodes.csv');
    const fileStream = fs.createReadStream(postcodesPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    
    let headers = null;
    let postcodeIndex, constituencyIndex, inUseIndex;
    let lineNumber = 0;
    let processedCount = 0;
    let activePostcodes = 0;
    let newMatches = 0;
    let totalMatches = 0;
    
    const allPostcodeToMP = { ...currentMapping }; // Start with existing mappings
    const newMappings = {};
    const stillUnmatched = new Set();
    
    console.log('🔄 Re-processing all postcodes with enhanced mappings...');
    
    for await (const line of rl) {
        lineNumber++;
        
        if (lineNumber === 1) {
            headers = line.split(',');
            postcodeIndex = headers.findIndex(h => h.toLowerCase().includes('postcode'));
            constituencyIndex = headers.findIndex(h => h.toLowerCase().includes('constituency name 2024'));
            inUseIndex = headers.findIndex(h => h.toLowerCase().includes('in use'));
            continue;
        }
        
        if (lineNumber % 200000 === 0) {
            console.log(`⏳ Processed ${lineNumber.toLocaleString()} lines... (${newMatches.toLocaleString()} new matches)`);
        }
        
        if (!line.trim()) continue;
        
        // Parse CSV line
        const fields = [];
        let currentField = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                fields.push(currentField.trim());
                currentField = '';
            } else {
                currentField += char;
            }
        }
        fields.push(currentField.trim());
        
        const postcode = fields[postcodeIndex];
        const constituency = fields[constituencyIndex];
        const inUse = fields[inUseIndex];
        
        if (!postcode || !constituency) continue;
        
        processedCount++;
        
        // Process all postcodes marked as active
        if (inUse && inUse.toLowerCase() === 'yes') {
            activePostcodes++;
            
            // Skip if already mapped
            if (currentPostcodes.has(postcode)) {
                totalMatches++;
                continue;
            }
            
            const cleanConstituency = constituency.replace(/"/g, '').toLowerCase();
            
            // Try direct match first
            let mpId = constituencyToMP[cleanConstituency];
            let matchType = 'direct';
            
            // If no direct match, try additional mappings
            if (!mpId && additionalConstituencyMappings[cleanConstituency]) {
                const mappedConstituency = additionalConstituencyMappings[cleanConstituency].toLowerCase();
                mpId = constituencyToMP[mappedConstituency];
                if (mpId) {
                    matchType = 'additional_mapping';
                    if (!newMappings[cleanConstituency]) {
                        newMappings[cleanConstituency] = { mapped_to: mappedConstituency, count: 0 };
                    }
                    newMappings[cleanConstituency].count++;
                }
            }
            
            // Try fuzzy matching for similar names
            if (!mpId) {
                for (const [mpConstituency, mpIdCandidate] of Object.entries(constituencyToMP)) {
                    if (areSimilarConstituencies(cleanConstituency, mpConstituency)) {
                        mpId = mpIdCandidate;
                        matchType = 'fuzzy';
                        break;
                    }
                }
            }
            
            if (mpId) {
                allPostcodeToMP[postcode] = mpId;
                newMatches++;
                totalMatches++;
            } else {
                stillUnmatched.add(cleanConstituency);
            }
        }
    }
    
    console.log('\n🎉 === PROCESSING COMPLETE ===');
    console.log(`📊 Total lines processed: ${lineNumber.toLocaleString()}`);
    console.log(`📊 Active postcodes: ${activePostcodes.toLocaleString()}`);
    console.log(`✅ Total matched postcodes: ${totalMatches.toLocaleString()}`);
    console.log(`🆕 New matches found: ${newMatches.toLocaleString()}`);
    console.log(`📈 Improved match rate: ${((totalMatches / activePostcodes) * 100).toFixed(2)}%`);
    console.log(`❌ Still unmatched constituencies: ${stillUnmatched.size}`);
    
    // Save the complete mapping
    console.log('\n💾 Saving complete mapping...');
    const completeMappingPath = path.join(__dirname, 'scripts/data/complete-parliament-data/postcode-mp-mapping-complete.json');
    fs.writeFileSync(completeMappingPath, JSON.stringify(allPostcodeToMP, null, 2));
    console.log(`✅ Saved complete mapping: ${completeMappingPath}`);
    
    // Update MPs with ALL real postcodes
    console.log('\n🔄 Updating MPs with ALL real postcodes...');
    const completeUpdatedMps = mpsData.map(mp => {
        const mpPostcodes = Object.keys(allPostcodeToMP).filter(postcode => 
            allPostcodeToMP[postcode] === mp.id
        );
        
        return {
            ...mp,
            postcodes: mpPostcodes,
            constituencyPostcodes: mpPostcodes,
            totalPostcodes: mpPostcodes.length
        };
    });
    
    const completeUpdatedMpsPath = path.join(__dirname, 'scripts/data/complete-parliament-data/mps-with-all-postcodes.json');
    fs.writeFileSync(completeUpdatedMpsPath, JSON.stringify(completeUpdatedMps, null, 2));
    console.log(`✅ Saved complete MP data: ${completeUpdatedMpsPath}`);
    
    // Create final statistics
    const completeStats = {
        summary: {
            totalActivePostcodes: activePostcodes,
            totalMatchedPostcodes: totalMatches,
            newMatchesAdded: newMatches,
            finalMatchRate: ((totalMatches / activePostcodes) * 100).toFixed(2) + '%',
            improvement: ((newMatches / activePostcodes) * 100).toFixed(2) + '%'
        },
        mappingResults: {
            totalMPs: mpsData.length,
            mpsWithPostcodes: completeUpdatedMps.filter(mp => mp.postcodes.length > 0).length,
            newMappingsUsed: Object.keys(newMappings).length,
            newMappingDetails: newMappings
        },
        stillUnmatched: [...stillUnmatched].slice(0, 50),
        timestamp: new Date().toISOString()
    };
    
    const completeStatsPath = path.join(__dirname, 'scripts/data/complete-parliament-data/postcode-mapping-complete-stats.json');
    fs.writeFileSync(completeStatsPath, JSON.stringify(completeStats, null, 2));
    
    console.log('\n📈 === FINAL RESULTS ===');
    console.log(`🎯 Final match rate: ${completeStats.summary.finalMatchRate}`);
    console.log(`📈 Total improvement: ${completeStats.summary.improvement}`);
    console.log(`👥 MPs with postcodes: ${completeStats.mappingResults.mpsWithPostcodes}/${completeStats.mappingResults.totalMPs}`);
    console.log(`🗺️ New mapping rules used: ${completeStats.mappingResults.newMappingsUsed}`);
    
    // Test the specific postcodes mentioned
    console.log('\n🧪 Testing specific postcodes:');
    const testCodes = ['DN16', 'HU18', 'YO16', 'YO12', 'TS9', 'DL1'];
    testCodes.forEach(code => {
        const matches = Object.keys(allPostcodeToMP).filter(pc => pc.startsWith(code));
        console.log(`  ${code}: ${matches.length} postcodes mapped`);
        if (matches.length > 0) {
            const examplePostcode = matches[0];
            const mpId = allPostcodeToMP[examplePostcode];
            const mp = mpsData.find(m => m.id === mpId);
            console.log(`    Example: ${examplePostcode} -> ${mp ? mp.displayName + ' (' + mp.constituency + ')' : 'Unknown MP'}`);
        }
    });
    
    console.log('\n🎉 ✅ Complete postcode-to-MP mapping finished!');
    console.log('\n📁 Files created:');
    console.log(`   📄 Complete mapping: postcode-mp-mapping-complete.json`);
    console.log(`   📄 Complete MP data: mps-with-all-postcodes.json`);
    console.log(`   📄 Complete statistics: postcode-mapping-complete-stats.json`);
}

function areSimilarConstituencies(const1, const2) {
    const words1 = const1.split(/\s+/);
    const words2 = const2.split(/\s+/);
    
    // Check if they share 2+ significant words (3+ characters)
    const sharedWords = words1.filter(w => 
        w.length > 2 && words2.some(w2 => w2.includes(w) || w.includes(w2))
    );
    
    return sharedWords.length >= 2;
}

// Run the function
fixMissingPostcodes().catch(console.error);
