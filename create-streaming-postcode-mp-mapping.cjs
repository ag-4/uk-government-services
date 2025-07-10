const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function createPostcodeMPMapping() {
    console.log('🚀 Starting comprehensive postcode-to-MP mapping...');
    
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
    
    const postcodeToMP = {};
    const enhancedLookup = {};
    const constituencyStats = {};
    const errors = [];
    
    console.log('🔄 Processing postcodes (streaming)...');
    
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
            console.log(`⏳ Processed ${lineNumber.toLocaleString()} lines...`);
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
            
            // Find matching MP
            let mpId = constituencyToMP[cleanConstituency];
            
            if (!mpId) {
                // Try partial matching for constituencies that might have slightly different names
                for (const [constName, constMpId] of Object.entries(constituencyToMP)) {
                    if (constName.includes(cleanConstituency) || cleanConstituency.includes(constName)) {
                        mpId = constMpId;
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
                    constituency: fields[constituencyIndex]?.replace(/"/g, ''),
                    county: fields[headers.findIndex(h => h.toLowerCase().includes('county'))]?.replace(/"/g, ''),
                    district: fields[headers.findIndex(h => h.toLowerCase().includes('district'))]?.replace(/"/g, ''),
                    ward: fields[headers.findIndex(h => h.toLowerCase().includes('ward'))]?.replace(/"/g, ''),
                    region: fields[headers.findIndex(h => h.toLowerCase().includes('region'))]?.replace(/"/g, ''),
                    country: fields[headers.findIndex(h => h.toLowerCase().includes('country'))]?.replace(/"/g, ''),
                    latitude: parseFloat(fields[headers.findIndex(h => h.toLowerCase().includes('latitude'))]) || null,
                    longitude: parseFloat(fields[headers.findIndex(h => h.toLowerCase().includes('longitude'))]) || null,
                    localAuthority: fields[headers.findIndex(h => h.toLowerCase().includes('local authority'))]?.replace(/"/g, ''),
                    ruralUrban: fields[headers.findIndex(h => h.toLowerCase().includes('rural/urban'))]?.replace(/"/g, ''),
                    nearestStation: fields[headers.findIndex(h => h.toLowerCase().includes('nearest station'))]?.replace(/"/g, ''),
                    distanceToStation: parseFloat(fields[headers.findIndex(h => h.toLowerCase().includes('distance to station'))]) || null,
                    policeForce: fields[headers.findIndex(h => h.toLowerCase().includes('police force'))]?.replace(/"/g, ''),
                    waterCompany: fields[headers.findIndex(h => h.toLowerCase().includes('water company'))]?.replace(/"/g, '')
                };
            } else {
                if (errors.length < 100) { // Limit error collection
                    errors.push(`No MP found for constituency: "${cleanConstituency}" (postcode: ${postcode})`);
                }
            }
        }
    }
    
    console.log('\n🎉 === PROCESSING COMPLETE ===');
    console.log(`📊 Total lines processed: ${lineNumber.toLocaleString()}`);
    console.log(`📊 Total postcodes processed: ${processedCount.toLocaleString()}`);
    console.log(`✅ Active postcodes: ${activePostcodes.toLocaleString()}`);
    console.log(`🎯 Matched postcodes: ${matchedPostcodes.toLocaleString()}`);
    console.log(`🏛️ Unique constituencies: ${Object.keys(constituencyStats).length}`);
    
    // Save the complete postcode-to-MP mapping
    console.log('\n💾 Saving files...');
    const mappingPath = path.join(__dirname, 'scripts/data/complete-parliament-data/postcode-mp-mapping-real.json');
    fs.writeFileSync(mappingPath, JSON.stringify(postcodeToMP, null, 2));
    console.log(`✅ Saved basic mapping: ${mappingPath}`);
    
    // Save enhanced lookup
    const enhancedPath = path.join(__dirname, 'scripts/data/complete-parliament-data/postcode-enhanced-lookup.json');
    fs.writeFileSync(enhancedPath, JSON.stringify(enhancedLookup, null, 2));
    console.log(`✅ Saved enhanced lookup: ${enhancedPath}`);
    
    // Update MPs with real postcodes
    console.log('\n🔄 Updating MPs with real postcodes...');
    const updatedMps = mpsData.map(mp => {
        // Find all postcodes for this MP
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
    
    // Save updated MPs
    const updatedMpsPath = path.join(__dirname, 'scripts/data/complete-parliament-data/mps-with-real-postcodes.json');
    fs.writeFileSync(updatedMpsPath, JSON.stringify(updatedMps, null, 2));
    console.log(`✅ Saved updated MPs: ${updatedMpsPath}`);
    
    // Create statistics
    const stats = {
        totalLinesProcessed: lineNumber,
        totalPostcodesProcessed: processedCount,
        activePostcodes: activePostcodes,
        matchedPostcodes: matchedPostcodes,
        matchRate: ((matchedPostcodes / activePostcodes) * 100).toFixed(2) + '%',
        totalMPs: mpsData.length,
        mpsWithPostcodes: updatedMps.filter(mp => mp.postcodes.length > 0).length,
        constituencies: Object.keys(constituencyStats).length,
        averagePostcodesPerConstituency: Math.round(matchedPostcodes / Object.keys(constituencyStats).length),
        topConstituencies: Object.entries(constituencyStats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([name, count]) => ({ constituency: name, postcodes: count })),
        errors: errors.slice(0, 20), // First 20 errors for debugging
        timestamp: new Date().toISOString()
    };
    
    const statsPath = path.join(__dirname, 'scripts/data/complete-parliament-data/postcode-mapping-stats.json');
    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
    
    console.log('\n📈 === FINAL STATISTICS ===');
    console.log(`🎯 Match rate: ${stats.matchRate}`);
    console.log(`👥 MPs with postcodes: ${stats.mpsWithPostcodes}/${stats.totalMPs}`);
    console.log(`📍 Average postcodes per constituency: ${stats.averagePostcodesPerConstituency}`);
    console.log(`📊 Statistics saved to: ${statsPath}`);
    
    if (errors.length > 0) {
        console.log(`\n⚠️ Warning: ${errors.length} constituencies could not be matched.`);
        console.log('First few errors:');
        errors.slice(0, 5).forEach(error => console.log(`  - ${error}`));
    }
    
    console.log('\n🎉 ✅ Complete postcode-to-MP mapping created successfully!');
    console.log('\n📁 Files created:');
    console.log(`   📄 Basic mapping: postcode-mp-mapping-real.json`);
    console.log(`   📄 Enhanced lookup: postcode-enhanced-lookup.json`);
    console.log(`   📄 Updated MPs: mps-with-real-postcodes.json`);
    console.log(`   📄 Statistics: postcode-mapping-stats.json`);
    
    return {
        postcodeToMP,
        enhancedLookup,
        updatedMps,
        stats
    };
}

// Run the function
createPostcodeMPMapping().catch(console.error);
