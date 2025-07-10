const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Specific mappings for the missing constituencies
const specificMappings = {
    'bridlington and the wolds': 'east yorkshire',
    'beverley and holderness': 'east yorkshire',
    'haltemprice and howden': 'kingston upon hull west and haltemprice',
    'hull north': 'kingston upon hull north and cottingham',
    'hull east': 'kingston upon hull east',
    'hull west and hessle': 'kingston upon hull west and haltemprice',
    'york': 'york central',
    'york outer': 'york outer',
    'selby and ainsty': 'selby',
    'ryedale': 'thirsk and malton',
    'scarborough and whitby': 'scarborough and whitby',
    'richmond (yorks)': 'richmond and northallerton',
    'richmond': 'richmond and northallerton',
    'skipton and ripon': 'skipton and ripon',
    'harrogate and knaresborough': 'harrogate and knaresborough',
    'leeds west': 'leeds west and pudsey',
    'leeds east': 'leeds east',
    'leeds central': 'leeds central and headingley',
    'leeds north east': 'leeds north east',
    'leeds north west': 'leeds north west',
    'leeds south': 'leeds south',
    'normanton, pontefract and castleford': 'normanton, pontefract and castleford',
    'morley and outwood': 'leeds south west and morley',
    'elmet and rothwell': 'elmet and rothwell',
    'pudsey': 'leeds west and pudsey',
    'keighley': 'keighley and ilkley',
    'shipley': 'shipley',
    'bradford east': 'bradford east',
    'bradford west': 'bradford west',
    'bradford south': 'bradford south',
    'halifax': 'halifax',
    'calder valley': 'calder valley',
    'dewsbury': 'dewsbury and batley',
    'batley and spen': 'dewsbury and batley',
    'wakefield': 'wakefield and rothwell',
    'hemsworth': 'hemsworth',
    'barnsley central': 'barnsley south',
    'barnsley east': 'barnsley north',
    'penistone and stocksbridge': 'penistone and stocksbridge',
    'wentworth and dearne': 'wentworth and dearne',
    'don valley': 'doncaster east and the isle of axholme',
    'doncaster central': 'doncaster central',
    'doncaster north': 'doncaster north',
    'rother valley': 'rother valley'
};

async function fixSpecificMissingPostcodes() {
    console.log('🎯 Fixing specific missing postcodes...');
    
    // Read current MP data
    const mpsPath = path.join(__dirname, 'scripts/data/complete-parliament-data/mps-complete-all.json');
    const mpsData = JSON.parse(fs.readFileSync(mpsPath, 'utf8'));
    
    // Create constituency to MP mapping
    const constituencyToMP = {};
    mpsData.forEach(mp => {
        if (mp.constituency && mp.isActive) {
            constituencyToMP[mp.constituency.toLowerCase()] = mp.id;
        }
    });
    
    console.log(`✅ Found ${Object.keys(constituencyToMP).length} MP constituencies`);
    
    // Read current mapping
    const currentMappingPath = path.join(__dirname, 'postcode-mp-mapping-FINAL.json');
    const currentMapping = JSON.parse(fs.readFileSync(currentMappingPath, 'utf8'));
    const updatedMapping = { ...currentMapping };
    
    console.log(`📊 Current mapping has ${Object.keys(currentMapping).length.toLocaleString()} postcodes`);
    
    // Check which specific mappings are valid
    console.log('\n🔍 Validating specific mappings:');
    const validMappings = {};
    Object.entries(specificMappings).forEach(([old, new_]) => {
        if (constituencyToMP[new_.toLowerCase()]) {
            validMappings[old] = new_;
            console.log(`  ✅ ${old} -> ${new_}`);
        } else {
            console.log(`  ❌ ${old} -> ${new_} (MP not found)`);
        }
    });
    
    // Stream through postcodes to find the missing ones
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
    const targetAreas = ['HU18', 'YO16', 'YO12', 'YO1', 'YO7', 'YO8', 'YO10', 'YO11', 'YO13'];
    
    console.log('\n🔄 Searching for missing postcodes...');
    
    for await (const line of rl) {
        lineNumber++;
        
        if (lineNumber === 1) {
            headers = line.split(',');
            postcodeIndex = headers.findIndex(h => h.toLowerCase().includes('postcode'));
            constituencyIndex = headers.findIndex(h => h.toLowerCase().includes('constituency name 2024'));
            inUseIndex = headers.findIndex(h => h.toLowerCase().includes('in use'));
            continue;
        }
        
        if (lineNumber % 500000 === 0) {
            console.log(`⏳ Processed ${lineNumber.toLocaleString()} lines... (${newMatches} new matches)`);
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
        
        // Only process active postcodes that are missing and in our target areas
        if (inUse && inUse.toLowerCase() === 'yes' && !updatedMapping[postcode]) {
            const isTargetArea = targetAreas.some(area => postcode.startsWith(area));
            
            if (isTargetArea) {
                const cleanConstituency = constituency.replace(/"/g, '').toLowerCase();
                
                // Try direct match first
                let mpId = constituencyToMP[cleanConstituency];
                
                // Try specific mappings
                if (!mpId && validMappings[cleanConstituency]) {
                    const mappedConstituency = validMappings[cleanConstituency].toLowerCase();
                    mpId = constituencyToMP[mappedConstituency];
                    
                    if (mpId) {
                        console.log(`  🔗 ${postcode}: ${cleanConstituency} -> ${mappedConstituency}`);
                    }
                }
                
                if (mpId) {
                    updatedMapping[postcode] = mpId;
                    newMatches++;
                }
            }
        }
    }
    
    console.log('\n🎉 === PROCESSING COMPLETE ===');
    console.log(`🆕 New matches found: ${newMatches.toLocaleString()}`);
    console.log(`📊 Total postcodes now: ${Object.keys(updatedMapping).length.toLocaleString()}`);
    
    // Save the updated mapping
    const updatedMappingPath = path.join(__dirname, 'postcode-mp-mapping-COMPLETE.json');
    fs.writeFileSync(updatedMappingPath, JSON.stringify(updatedMapping, null, 2));
    console.log(`✅ Saved updated mapping: ${updatedMappingPath}`);
    
    // Test the specific postcodes again
    console.log('\n🧪 Testing the problematic postcodes:');
    const testPostcodes = ['DN16 1AA', 'HU18 1AB', 'YO16 4AA', 'YO12 1AA', 'TS9 5AA', 'DL1 1AA'];
    testPostcodes.forEach(pc => {
        const mpId = updatedMapping[pc];
        if (mpId) {
            const mp = mpsData.find(m => m.id === mpId);
            console.log(`  ✅ ${pc}: ${mp ? mp.displayName + ' (' + mp.constituency + ')' : 'Unknown MP'}`);
        } else {
            console.log(`  ❌ ${pc}: Still not found`);
        }
    });
    
    // Create a final test script
    const finalTestScript = `
const mapping = require('./postcode-mp-mapping-COMPLETE.json');
const mps = require('./scripts/data/complete-parliament-data/mps-complete-all.json');

function findMP(postcode) {
    const cleanPostcode = postcode.toUpperCase().replace(/\\s+/g, ' ').trim();
    const mpId = mapping[cleanPostcode];
    if (!mpId) return null;
    
    const mp = mps.find(m => m.id === mpId);
    return mp ? {
        postcode: cleanPostcode,
        mp: mp.displayName,
        constituency: mp.constituency,
        party: mp.party,
        email: mp.email,
        phone: mp.phone
    } : null;
}

// Test function for your website
function searchPostcode(input) {
    // Try exact match first
    let result = findMP(input);
    if (result) return result;
    
    // Try variations
    const variations = [
        input.toUpperCase(),
        input.toUpperCase().replace(/\\s+/g, ' '),
        input.toUpperCase().replace(/\\s+/g, ''),
        input.replace(/\\s+/g, ' ').toUpperCase()
    ];
    
    for (const variation of variations) {
        result = findMP(variation);
        if (result) return result;
    }
    
    return null;
}

// Test all the problematic postcodes
console.log('=== FINAL POSTCODE TEST ===');
const testCodes = ['DN16 1AA', 'HU18 1AB', 'YO16 4AA', 'YO12 1AA', 'TS9 5AA', 'DL1 1AA'];
testCodes.forEach(pc => {
    const result = searchPostcode(pc);
    if (result) {
        console.log(\`✅ \${pc}: \${result.mp} (\${result.constituency})\`);
    } else {
        console.log(\`❌ \${pc}: No MP found\`);
    }
});

console.log('\\n📊 STATISTICS:');
console.log(\`Total postcodes mapped: \${Object.keys(mapping).length.toLocaleString()}\`);

module.exports = { findMP, searchPostcode };
`;
    
    fs.writeFileSync(path.join(__dirname, 'final-postcode-test.cjs'), finalTestScript);
    console.log('✅ Created final test script: final-postcode-test.cjs');
    
    console.log('\n🎉 COMPLETE! Your postcodes should now work.');
    console.log('\n📁 Files ready:');
    console.log('  📄 postcode-mp-mapping-COMPLETE.json - Complete mapping');
    console.log('  📄 final-postcode-test.cjs - Test script');
    console.log('\n💡 Run: node final-postcode-test.cjs');
}

// Run the function
fixSpecificMissingPostcodes().catch(console.error);
