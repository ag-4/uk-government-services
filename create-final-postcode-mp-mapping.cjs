const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Comprehensive mapping of old constituency names to new 2024 constituency names
const constituencyMappings = {
    // Major Scottish constituency changes
    'aberdeen north': 'aberdeen south', // Aberdeen North was merged into Aberdeen South
    'gordon and buchan': 'gordon and buchan', // This might be correct already
    'moray west, nairn and strathspey': 'aberdeenshire north and moray east',
    'angus and perthshire glens': 'angus and perthshire glens', // Check if this is new boundary
    
    // English constituency changes
    'st albans': 'st albans',
    'welwyn hatfield': 'welwyn hatfield',
    'luton south and south bedfordshire': 'luton south and south bedfordshire',
    'hitchin': 'hitchin',
    'stevenage': 'stevenage',
    
    // Birmingham area changes
    'birmingham ladywood': 'birmingham ladywood',
    'birmingham yardley': 'birmingham yardley', 
    'birmingham selly oak': 'birmingham selly oak',
    'solihull west and shirley': 'solihull west and shirley',
    'birmingham edgbaston': 'birmingham edgbaston',
    'birmingham perry barr': 'birmingham perry barr',
    'birmingham erdington': 'birmingham erdington',
    'meriden and solihull east': 'meriden and solihull east',
    
    // More comprehensive mappings - these are educated guesses based on boundary review
    'aldridge-brownhills': 'aldridge-brownhills',
    'north warwickshire and bedworth': 'north warwickshire and bedworth',
    'nuneaton': 'nuneaton',
    'stratford-on-avon': 'stratford-on-avon',
    'redditch': 'redditch',
    'droitwich and evesham': 'droitwich and evesham',
    'stourbridge': 'stourbridge',
    'tamworth': 'tamworth',
    'hinckley and bosworth': 'hinckley and bosworth',
    'kenilworth and southam': 'kenilworth and southam',
    'thornbury and yate': 'thornbury and yate',
    
    // Somerset
    'north east somerset and hanham': 'north east somerset and hanham',
    'glastonbury and somerton': 'glastonbury and somerton',
    
    // More areas
    'salisbury': 'salisbury',
    'blackburn': 'blackburn',
    'rossendale and darwen': 'rossendale and darwen',
    'ribble valley': 'ribble valley',
    'chorley': 'chorley',
    
    // Bradford area
    'bradford west': 'bradford west',
    'bradford east': 'bradford east',
    'leeds west and pudsey': 'leeds west and pudsey',
    'shipley': 'shipley',
    'leeds south west and morley': 'leeds south west and morley',
    'spen valley': 'spen valley',
    'bradford south': 'bradford south',
    'halifax': 'halifax',
    
    // Bournemouth
    'bournemouth east': 'bournemouth east',
    'bournemouth west': 'bournemouth west',
    'mid dorset and north poole': 'mid dorset and north poole',
    'new forest east': 'new forest east',
    
    // Bolton
    'bolton south and walkden': 'bolton south and walkden',
    'bolton west': 'bolton west',
    
    // Add many more known constituency name mappings
    // These are cases where the constituency exists but might have different naming
    'bromsgrove': 'bromsgrove',
    'bury st edmunds': 'bury st edmunds and stowmarket',
    'central suffolk and north ipswich': 'central suffolk and north ipswich',
    'suffolk coastal': 'suffolk coastal',
    'south suffolk': 'south suffolk',
    'west suffolk': 'west suffolk',
    'ipswich': 'ipswich',
    'waveney': 'waveney valley',
    
    // More Welsh constituencies  
    'ceredigion': 'ceredigion preseli',
    'carmarthen east and dinefwr': 'caerfyrddin',
    'carmarthen west and south pembrokeshire': 'caerfyrddin',
    'llanelli': 'llanelli',
    'gower': 'gower',
    'neath': 'neath and swansea east',
    'aberavon': 'aberafan maesteg',
    'bridgend': 'bridgend',
    'ogmore': 'ogmore',
    'rhondda': 'rhondda and ogmore',
    'pontypridd': 'pontypridd',
    'cynon valley': 'cynon valley',
    'merthyr tydfil and rhymney': 'merthyr tydfil and aberdare',
    'blaenau gwent': 'blaenau gwent and rhymney',
    'islwyn': 'newport west and islwyn',
    'caerphilly': 'caerphilly',
    'newport east': 'newport east',
    'newport west': 'newport west and islwyn',
    'monmouth': 'monmouthshire',
    'torfaen': 'torfaen',
    'cardiff north': 'cardiff north',
    'cardiff central': 'cardiff south and penarth',
    'cardiff south and penarth': 'cardiff south and penarth',
    'cardiff west': 'cardiff west',
    'vale of glamorgan': 'vale of glamorgan',
    
    // Northern Irish constituencies (these typically don't change much)
    'belfast east': 'belfast east',
    'belfast north': 'belfast north', 
    'belfast south': 'belfast south and mid down',
    'belfast west': 'belfast west',
    'north antrim': 'north antrim',
    'south antrim': 'south antrim',
    'east antrim': 'east antrim',
    'upper bann': 'upper bann',
    'lagan valley': 'lagan valley',
    'south down': 'south down',
    'north down': 'north down',
    'strangford': 'strangford',
    'east londonderry': 'east derry',
    'foyle': 'foyle',
    'west tyrone': 'west tyrone',
    'mid ulster': 'mid ulster',
    'fermanagh and south tyrone': 'fermanagh and south tyrone',
    
    // Add fallback mappings for partial matches
};

async function createFinalPostcodeMPMapping() {
    console.log('🚀 Creating final comprehensive postcode-to-MP mapping...');
    
    // Read the current MP data
    console.log('📖 Reading MP data...');
    const mpsPath = path.join(__dirname, 'scripts/data/complete-parliament-data/mps-complete-all.json');
    const mpsData = JSON.parse(fs.readFileSync(mpsPath, 'utf8'));
    
    // Create constituency to MP mapping
    const constituencyToMP = {};
    mpsData.forEach(mp => {
        if (mp.constituency && mp.isActive) {
            constituencyToMP[mp.constituency.toLowerCase()] = mp.id;
        }
    });
    
    console.log(`✅ Found ${Object.keys(constituencyToMP).length} constituencies with MPs`);
    
    // Setup streaming for postcodes CSV
    const postcodesPath = path.join(__dirname, 'postcodes.csv');
    const fileStream = fs.createReadStream(postcodesPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    
    // Variables for processing
    let headers = null;
    let postcodeIndex, constituencyIndex, inUseIndex;
    let lineNumber = 0;
    let processedCount = 0;
    let activePostcodes = 0;
    let matchedPostcodes = 0;
    let mappedPostcodes = 0;
    
    const postcodeToMP = {};
    const enhancedLookup = {};
    const constituencyStats = {};
    const mappingStats = {};
    const unmatchedConstituencies = new Set();
    
    console.log('🔄 Processing postcodes with enhanced mappings...');
    
    for await (const line of rl) {
        lineNumber++;
        
        if (lineNumber === 1) {
            // Parse headers
            headers = line.split(',');
            postcodeIndex = headers.findIndex(h => h.toLowerCase().includes('postcode'));
            constituencyIndex = headers.findIndex(h => h.toLowerCase().includes('constituency name 2024'));
            inUseIndex = headers.findIndex(h => h.toLowerCase().includes('in use'));
            
            console.log(`📋 Found columns: Postcode(${postcodeIndex}), Constituency(${constituencyIndex}), InUse(${inUseIndex})`);
            continue;
        }
        
        if (lineNumber % 100000 === 0) {
            console.log(`⏳ Processed ${lineNumber.toLocaleString()} lines... (${matchedPostcodes.toLocaleString()} matched)`);
        }
        
        if (!line.trim()) continue;
        
        // Parse CSV line (handle quoted fields)
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
        fields.push(currentField.trim()); // Add the last field
        
        const postcode = fields[postcodeIndex];
        const constituency = fields[constituencyIndex];
        const inUse = fields[inUseIndex];
        
        if (!postcode || !constituency) continue;
        
        processedCount++;
        
        // Only process active postcodes
        if (inUse && inUse.toLowerCase() === 'yes') {
            activePostcodes++;
            
            // Clean constituency name
            const cleanConstituency = constituency.replace(/"/g, '').toLowerCase();
            
            // Try direct match first
            let mpId = constituencyToMP[cleanConstituency];
            let matchType = 'direct';
            
            // If no direct match, try mapping
            if (!mpId && constituencyMappings[cleanConstituency]) {
                const mappedConstituency = constituencyMappings[cleanConstituency].toLowerCase();
                mpId = constituencyToMP[mappedConstituency];
                if (mpId) {
                    matchType = 'mapped';
                    mappedPostcodes++;
                    if (!mappingStats[cleanConstituency]) {
                        mappingStats[cleanConstituency] = { 
                            mapped_to: mappedConstituency, 
                            count: 0 
                        };
                    }
                    mappingStats[cleanConstituency].count++;
                }
            }
            
            // If still no match, try fuzzy matching
            if (!mpId) {
                for (const [mpConstituency, mpIdCandidate] of Object.entries(constituencyToMP)) {
                    if (isPartialMatch(cleanConstituency, mpConstituency)) {
                        mpId = mpIdCandidate;
                        matchType = 'fuzzy';
                        break;
                    }
                }
            }
            
            if (mpId) {
                postcodeToMP[postcode] = mpId;
                matchedPostcodes++;
                
                // Track constituency stats
                if (!constituencyStats[cleanConstituency]) {
                    constituencyStats[cleanConstituency] = 0;
                }
                constituencyStats[cleanConstituency]++;
                
                // Create enhanced entry with all useful information
                enhancedLookup[postcode] = {
                    mpId: mpId,
                    constituency: cleanConstituency,
                    matchType: matchType,
                    county: fields[headers.findIndex(h => h.toLowerCase().includes('county'))]?.replace(/"/g, '') || '',
                    district: fields[headers.findIndex(h => h.toLowerCase().includes('district'))]?.replace(/"/g, '') || '',
                    ward: fields[headers.findIndex(h => h.toLowerCase().includes('ward'))]?.replace(/"/g, '') || '',
                    region: fields[headers.findIndex(h => h.toLowerCase().includes('region'))]?.replace(/"/g, '') || '',
                    country: fields[headers.findIndex(h => h.toLowerCase().includes('country'))]?.replace(/"/g, '') || '',
                    latitude: parseFloat(fields[headers.findIndex(h => h.toLowerCase().includes('latitude'))]) || null,
                    longitude: parseFloat(fields[headers.findIndex(h => h.toLowerCase().includes('longitude'))]) || null,
                    localAuthority: fields[headers.findIndex(h => h.toLowerCase().includes('local authority'))]?.replace(/"/g, '') || '',
                    ruralUrban: fields[headers.findIndex(h => h.toLowerCase().includes('rural/urban'))]?.replace(/"/g, '') || '',
                    nearestStation: fields[headers.findIndex(h => h.toLowerCase().includes('nearest station'))]?.replace(/"/g, '') || '',
                    distanceToStation: parseFloat(fields[headers.findIndex(h => h.toLowerCase().includes('distance to station'))]) || null,
                    policeForce: fields[headers.findIndex(h => h.toLowerCase().includes('police force'))]?.replace(/"/g, '') || '',
                    waterCompany: fields[headers.findIndex(h => h.toLowerCase().includes('water company'))]?.replace(/"/g, '') || ''
                };
            } else {
                unmatchedConstituencies.add(cleanConstituency);
            }
        }
    }
    
    console.log('\n🎉 === PROCESSING COMPLETE ===');
    console.log(`📊 Total lines processed: ${lineNumber.toLocaleString()}`);
    console.log(`📊 Total postcodes processed: ${processedCount.toLocaleString()}`);
    console.log(`✅ Active postcodes: ${activePostcodes.toLocaleString()}`);
    console.log(`🎯 Matched postcodes: ${matchedPostcodes.toLocaleString()}`);
    console.log(`🔗 Mapped via table: ${mappedPostcodes.toLocaleString()}`);
    console.log(`🏛️ Unique matched constituencies: ${Object.keys(constituencyStats).length}`);
    console.log(`❌ Unmatched constituencies: ${unmatchedConstituencies.size}`);
    
    // Save all the files
    console.log('\n💾 Saving files...');
    
    // Basic mapping
    const mappingPath = path.join(__dirname, 'scripts/data/complete-parliament-data/postcode-mp-mapping-final.json');
    fs.writeFileSync(mappingPath, JSON.stringify(postcodeToMP, null, 2));
    console.log(`✅ Saved final mapping: ${mappingPath}`);
    
    // Enhanced lookup
    const enhancedPath = path.join(__dirname, 'scripts/data/complete-parliament-data/postcode-enhanced-lookup-final.json');
    fs.writeFileSync(enhancedPath, JSON.stringify(enhancedLookup, null, 2));
    console.log(`✅ Saved enhanced lookup: ${enhancedPath}`);
    
    // Update MPs with real postcodes
    console.log('\n🔄 Updating MPs with real postcodes...');
    const updatedMps = mpsData.map(mp => {
        const mpPostcodes = Object.keys(postcodeToMP).filter(postcode => 
            postcodeToMP[postcode] === mp.id
        );
        
        return {
            ...mp,
            postcodes: mpPostcodes,
            constituencyPostcodes: mpPostcodes,
            totalPostcodes: mpPostcodes.length
        };
    });
    
    const updatedMpsPath = path.join(__dirname, 'scripts/data/complete-parliament-data/mps-with-real-postcodes-final.json');
    fs.writeFileSync(updatedMpsPath, JSON.stringify(updatedMps, null, 2));
    console.log(`✅ Saved updated MPs: ${updatedMpsPath}`);
    
    // Create comprehensive statistics
    const finalStats = {
        summary: {
            totalLinesProcessed: lineNumber,
            totalPostcodesProcessed: processedCount,
            activePostcodes: activePostcodes,
            matchedPostcodes: matchedPostcodes,
            mappedPostcodes: mappedPostcodes,
            matchRate: ((matchedPostcodes / activePostcodes) * 100).toFixed(2) + '%',
            improvementFromMapping: ((mappedPostcodes / activePostcodes) * 100).toFixed(2) + '%'
        },
        constituencies: {
            totalMPs: mpsData.length,
            mpsWithPostcodes: updatedMps.filter(mp => mp.postcodes.length > 0).length,
            uniqueMatchedConstituencies: Object.keys(constituencyStats).length,
            averagePostcodesPerConstituency: Math.round(matchedPostcodes / Object.keys(constituencyStats).length)
        },
        mappingEffectiveness: {
            totalMappingRules: Object.keys(constituencyMappings).length,
            usedMappingRules: Object.keys(mappingStats).length,
            mappingStats: mappingStats
        },
        topConstituencies: Object.entries(constituencyStats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 20)
            .map(([name, count]) => ({ constituency: name, postcodes: count })),
        unmatchedConstituencies: [...unmatchedConstituencies].slice(0, 50),
        timestamp: new Date().toISOString()
    };
    
    const finalStatsPath = path.join(__dirname, 'scripts/data/complete-parliament-data/postcode-mapping-final-stats.json');
    fs.writeFileSync(finalStatsPath, JSON.stringify(finalStats, null, 2));
    
    console.log('\n📈 === FINAL STATISTICS ===');
    console.log(`🎯 Final match rate: ${finalStats.summary.matchRate}`);
    console.log(`🔗 Improvement from mapping: ${finalStats.summary.improvementFromMapping}`);
    console.log(`👥 MPs with postcodes: ${finalStats.constituencies.mpsWithPostcodes}/${finalStats.constituencies.totalMPs}`);
    console.log(`📍 Average postcodes per constituency: ${finalStats.constituencies.averagePostcodesPerConstituency}`);
    console.log(`📊 Statistics saved to: ${finalStatsPath}`);
    
    if (unmatchedConstituencies.size > 0) {
        console.log(`\n⚠️ Warning: ${unmatchedConstituencies.size} constituencies still unmatched.`);
        console.log('Top unmatched constituencies:');
        [...unmatchedConstituencies].slice(0, 10).forEach(constName => console.log(`  - ${constName}`));
    }
    
    console.log('\n🎉 ✅ Final comprehensive postcode-to-MP mapping created successfully!');
    console.log('\n📁 Files created:');
    console.log(`   📄 Final mapping: postcode-mp-mapping-final.json`);
    console.log(`   📄 Enhanced lookup: postcode-enhanced-lookup-final.json`);
    console.log(`   📄 Updated MPs: mps-with-real-postcodes-final.json`);
    console.log(`   📄 Statistics: postcode-mapping-final-stats.json`);
}

function isPartialMatch(constituency1, constituency2) {
    const words1 = constituency1.split(/\s+/);
    const words2 = constituency2.split(/\s+/);
    
    // Check if they share 2+ significant words
    const sharedWords = words1.filter(w => 
        w.length > 3 && words2.includes(w)
    );
    
    return sharedWords.length >= 2;
}

// Run the function
createFinalPostcodeMPMapping().catch(console.error);
