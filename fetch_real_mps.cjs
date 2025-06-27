const https = require('https');
const fs = require('fs');

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = '';
            
            response.on('data', (chunk) => {
                data += chunk;
            });
            
            response.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

function getPartyColor(partyName) {
    const colors = {
        'Conservative': '0087dc',
        'Labour': 'e4003b',
        'Liberal Democrat': 'faa61a',
        'Scottish National Party': 'fff95d',
        'Green Party': '6ab023',
        'Reform UK': '12b6cf',
        'Plaid Cymru': '008142',
        'Democratic Unionist Party': 'd46a4c',
        'Social Democratic and Labour Party': '2aa82c',
        'Alliance Party of Northern Ireland': 'f6cb2f',
        'Ulster Unionist Party': '9999ff',
        'Independent': '909090'
    };
    return colors[partyName] || '909090';
}

async function fetchRealMPData() {
    const baseUrl = "https://members-api.parliament.uk/api";
    const currentMPsUrl = `${baseUrl}/Members/Search?House=Commons&IsCurrentMember=true`;
    
    console.log("Fetching current MPs from UK Parliament API...");
    
    try {
        const mpsData = await fetchJSON(currentMPsUrl);
        console.log(`Found ${mpsData.items.length} current MPs`);
        
        const processedMPs = [];
        
        for (let i = 0; i < mpsData.items.length; i++) {
            const mp = mpsData.items[i];
            
            if (i % 50 === 0) {
                console.log(`Processing MP ${i + 1}/${mpsData.items.length}`);
            }
            
            const mpId = mp.value.id;
            
            // Fetch contact details
            let contactData = { value: [] };
            try {
                const contactUrl = `${baseUrl}/Members/${mpId}/Contact`;
                contactData = await fetchJSON(contactUrl);
                
                // Add small delay to avoid overwhelming the API
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.log(`Could not fetch contact for MP ${mpId}: ${error.message}`);
            }
            
            // Fetch constituency details
            let constituencyData = { value: [] };
            try {
                const constituencyUrl = `${baseUrl}/Members/${mpId}/Constituencies?since=2019-01-01`;
                constituencyData = await fetchJSON(constituencyUrl);
                
                // Add small delay to avoid overwhelming the API
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.log(`Could not fetch constituency for MP ${mpId}: ${error.message}`);
            }
            
            // Process MP data
            const mpInfo = mp.value;
            
            // Get current constituency
            let currentConstituency = null;
            if (constituencyData.value) {
                for (const const_ of constituencyData.value) {
                    if (const_.endDate === null) { // Current constituency
                        currentConstituency = const_;
                        break;
                    }
                }
            }
            
            // Extract contact information
            let email = null;
            let phone = null;
            const addresses = [];
            
            for (const contact of contactData.value || []) {
                if (contact.type === 'Parliamentary') {
                    if (contact.email) email = contact.email;
                    if (contact.phone) phone = contact.phone;
                    
                    addresses.push({
                        type: "Parliamentary",
                        fullAddress: "House of Commons, Westminster, London SW1A 0AA",
                        postcode: "SW1A 0AA",
                        line1: "House of Commons",
                        line2: "Westminster",
                        town: "London",
                        county: "Greater London",
                        country: "UK"
                    });
                } else if (contact.type === 'Constituency' && contact.postcode) {
                    addresses.push({
                        type: "Constituency",
                        fullAddress: `${contact.line1 || ''}${contact.line2 ? ', ' + contact.line2 : ''}`,
                        postcode: contact.postcode || '',
                        line1: contact.line1 || '',
                        line2: contact.line2 || '',
                        town: contact.town || '',
                        county: contact.county || '',
                        country: "UK"
                    });
                }
            }
            
            // Create processed MP record
            const processedMP = {
                id: `MP${mpInfo.id}`,
                parliamentId: mpInfo.id,
                name: mpInfo.nameDisplayAs,
                displayName: mpInfo.nameFullTitle || mpInfo.nameDisplayAs,
                fullTitle: mpInfo.nameFullTitle || mpInfo.nameDisplayAs,
                constituency: currentConstituency ? currentConstituency.name : "Unknown",
                constituencyId: currentConstituency ? currentConstituency.id : null,
                party: mpInfo.latestParty ? mpInfo.latestParty.name : "Unknown",
                partyAbbreviation: mpInfo.latestParty ? mpInfo.latestParty.abbreviation : "",
                partyColor: getPartyColor(mpInfo.latestParty ? mpInfo.latestParty.name : ""),
                gender: mpInfo.gender || "U",
                membershipStartDate: mpInfo.membershipStartDate || "",
                membershipEndDate: mpInfo.membershipEndDate,
                isActive: true,
                email: email,
                phone: phone,
                website: null,
                addresses: addresses,
                biography: `${mpInfo.nameDisplayAs} is the ${mpInfo.latestParty ? mpInfo.latestParty.name : 'Unknown'} MP for ${currentConstituency ? currentConstituency.name : 'Unknown'}.`,
                thumbnailUrl: `https://members-api.parliament.uk/api/Members/${mpInfo.id}/Thumbnail`,
                postcodes: [],
                constituencyPostcodes: [],
                committees: [],
                experience: [],
                socialMedia: {}
            };
            
            processedMPs.push(processedMP);
        }
        
        return processedMPs;
        
    } catch (error) {
        console.error(`Error fetching MP data: ${error.message}`);
        return null;
    }
}

async function main() {
    console.log("Starting MP data fetch...");
    const mps = await fetchRealMPData();
    
    if (mps) {
        // Save to file
        fs.writeFileSync('real_mps_complete.json', JSON.stringify(mps, null, 2), 'utf8');
        console.log(`Successfully saved ${mps.length} MPs to real_mps_complete.json`);
        
        // Show some examples
        console.log("\nFirst 3 MPs as examples:");
        for (let i = 0; i < Math.min(3, mps.length); i++) {
            const mp = mps[i];
            console.log(`- ${mp.name} (${mp.party}) - ${mp.constituency}`);
            console.log(`  Email: ${mp.email}`);
            console.log(`  Phone: ${mp.phone}`);
            console.log('');
        }
        
        // Show data quality statistics
        const withEmail = mps.filter(mp => mp.email).length;
        const withPhone = mps.filter(mp => mp.phone).length;
        
        console.log(`\nData quality statistics:`);
        console.log(`Total MPs: ${mps.length}`);
        console.log(`MPs with email: ${withEmail} (${Math.round(withEmail/mps.length*100)}%)`);
        console.log(`MPs with phone: ${withPhone} (${Math.round(withPhone/mps.length*100)}%)`);
        
    } else {
        console.log("Failed to fetch MP data");
    }
}

main().catch(console.error);
