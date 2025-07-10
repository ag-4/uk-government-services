const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function analyzeConstituencyMismatches() {
    console.log('🔍 Analyzing constituency mismatches...');
    
    // Read MP data to get official constituency names
    const mpsPath = path.join(__dirname, 'scripts/data/complete-parliament-data/mps-complete-all.json');
    const mpsData = JSON.parse(fs.readFileSync(mpsPath, 'utf8'));
    
    const mpConstituencies = new Set(mpsData
        .filter(mp => mp.constituency && mp.isActive)
        .map(mp => mp.constituency.toLowerCase())
    );
    
    console.log(`✅ Found ${mpConstituencies.size} MP constituencies`);
    
    // Stream through postcodes.csv to find all unique constituency names
    const postcodesPath = path.join(__dirname, 'postcodes.csv');
    const fileStream = fs.createReadStream(postcodesPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    
    let headers = null;
    let constituencyIndex;
    let inUseIndex;
    const postcodeConstituencies = new Set();
    let lineNumber = 0;
    
    console.log('📄 Scanning postcode constituencies...');
    
    for await (const line of rl) {
        lineNumber++;
        
        if (lineNumber === 1) {
            headers = line.split(',');
            constituencyIndex = headers.findIndex(h => h.toLowerCase().includes('constituency name 2024'));
            inUseIndex = headers.findIndex(h => h.toLowerCase().includes('in use'));
            continue;
        }
        
        if (lineNumber % 200000 === 0) {
            console.log(`  Processed ${lineNumber.toLocaleString()} lines...`);
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
        
        const constituency = fields[constituencyIndex];
        const inUse = fields[inUseIndex];
        
        if (constituency && inUse && inUse.toLowerCase() === 'yes') {
            const cleanConstituency = constituency.replace(/"/g, '').toLowerCase();
            if (cleanConstituency) {
                postcodeConstituencies.add(cleanConstituency);
            }
        }
    }
    
    console.log(`\n✅ Found ${postcodeConstituencies.size} unique constituencies in postcode data`);
    
    // Find mismatches
    const matchingConstituencies = [];
    const mismatchedConstituencies = [];
    
    for (const postConstituency of postcodeConstituencies) {
        if (mpConstituencies.has(postConstituency)) {
            matchingConstituencies.push(postConstituency);
        } else {
            mismatchedConstituencies.push(postConstituency);
        }
    }
    
    console.log(`\n📊 Analysis Results:`);
    console.log(`✅ Matching: ${matchingConstituencies.length}`);
    console.log(`❌ Mismatched: ${mismatchedConstituencies.length}`);
    
    // Try to find potential matches for mismatched constituencies
    console.log(`\n🔍 Finding potential matches for mismatched constituencies...`);
    
    const potentialMatches = {};
    const manualMappings = {};
    
    for (const mismatched of mismatchedConstituencies.slice(0, 50)) { // Limit to first 50 for performance
        const matches = [];
        
        for (const mpConstituency of mpConstituencies) {
            const score = calculateSimilarity(mismatched, mpConstituency);
            if (score > 0.3) { // Threshold for potential matches
                matches.push({ constituency: mpConstituency, score });
            }
        }
        
        matches.sort((a, b) => b.score - a.score);
        
        if (matches.length > 0) {
            potentialMatches[mismatched] = matches.slice(0, 5); // Top 5 matches
            
            // If there's a very good match (>0.7), add it to manual mappings
            if (matches[0].score > 0.7) {
                manualMappings[mismatched] = matches[0].constituency;
            }
        }
        
        console.log(`  "${mismatched}":`);
        matches.slice(0, 3).forEach(match => {
            console.log(`    ${(match.score * 100).toFixed(1)}% - ${match.constituency}`);
        });
    }
    
    // Known constituency boundary changes (2024 boundaries)
    const knownMappings = {
        // These are educated guesses based on boundary changes
        'aberdeenshire west and kincardine': 'west aberdeenshire and kincardine',
        'angus': 'angus and perthshire glens',
        'argyll and bute': 'argyll, bute and south lochaber',
        'banff and buchan': 'banffshire and buchan coast',
        'berwickshire, roxburgh and selkirk': 'roxburgh, selkirk and southern tweeddale',
        'caithness, sutherland and easter ross': 'caithness, sutherland and easter ross',
        'central ayrshire': 'ayr, carrick and cumnock',
        'dumfries and galloway': 'dumfries and galloway',
        'east renfrewshire': 'east renfrewshire',
        'glasgow central': 'glasgow west',
        'glasgow east': 'glasgow east',
        'glasgow north': 'glasgow north',
        'glasgow north east': 'glasgow north east',
        'glasgow north west': 'glasgow north west',
        'glasgow south': 'glasgow south',
        'glasgow south west': 'glasgow south west',
        'gordon': 'gordon and buchan',
        'inverness, nairn, badenoch and strathspey': 'inverness, skye and west ross-shire',
        'kilmarnock and irvine valley': 'kilmarnock and irvine valley',
        'kirkcaldy and cowdenbeath': 'kirkcaldy and cowdenbeath',
        'lanark and hamilton east': 'east kilbride and strathaven',
        'livingston': 'livingston',
        'moray': 'aberdeenshire north and moray east',
        'motherwell and wishaw': 'motherwell, wishaw and carluke',
        'na h-eileanan an iar': 'na h-eileanan an iar',
        'north ayrshire and arran': 'north ayrshire and arran',
        'ochil and south perthshire': 'alloa and grangemouth',
        'paisley and renfrewshire north': 'paisley and renfrewshire north',
        'paisley and renfrewshire south': 'paisley and renfrewshire south',
        'perth and north perthshire': 'perth and kinross-shire',
        'ross, skye and lochaber': 'inverness, skye and west ross-shire',
        'rutherglen and hamilton west': 'rutherglen',
        'stirling': 'stirling and strathallan',
        'west dunbartonshire': 'clydebank and milngavie',
        
        // Add more as needed...
    };
    
    // Merge mappings
    const finalMappings = { ...manualMappings, ...knownMappings };
    
    // Save analysis results
    const analysisData = {
        summary: {
            mpConstituencies: mpConstituencies.size,
            postcodeConstituencies: postcodeConstituencies.size,
            matching: matchingConstituencies.length,
            mismatched: mismatchedConstituencies.length,
            potentialMappings: Object.keys(finalMappings).length
        },
        matchingConstituencies: [...matchingConstituencies].sort(),
        mismatchedConstituencies: mismatchedConstituencies.sort(),
        potentialMatches,
        finalMappings,
        timestamp: new Date().toISOString()
    };
    
    const analysisPath = path.join(__dirname, 'constituency-analysis-complete.json');
    fs.writeFileSync(analysisPath, JSON.stringify(analysisData, null, 2));
    
    console.log(`\n💾 Saved complete analysis to: ${analysisPath}`);
    console.log(`📈 Potential improvement: ${Object.keys(finalMappings).length} additional mappings found`);
    
    return analysisData;
}

function calculateSimilarity(str1, str2) {
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);
    
    let score = 0;
    let maxPossibleScore = Math.max(words1.length, words2.length);
    
    // Check for exact word matches
    for (const word1 of words1) {
        if (word1.length > 2 && words2.includes(word1)) {
            score += 1;
        }
    }
    
    // Check for partial matches
    for (const word1 of words1) {
        for (const word2 of words2) {
            if (word1.length > 3 && word2.length > 3) {
                if (word1.includes(word2) || word2.includes(word1)) {
                    score += 0.5;
                }
            }
        }
    }
    
    return Math.min(score / maxPossibleScore, 1);
}

// Run the analysis
analyzeConstituencyMismatches().catch(console.error);
