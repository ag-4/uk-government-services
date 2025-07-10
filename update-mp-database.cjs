const fs = require('fs');
const https = require('https');

// Load MP data
fs.readFile('sample-mps.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file', err);
        return;
    }

    const mpData = JSON.parse(data).items.map(item => item.value);

    // Transform into the desired format
    const transformedData = mpData.map(mp => ({
        id: `MP${mp.id}`,
        name: mp.nameDisplayAs,
        fullTitle: mp.nameFullTitle,
        constituency: mp.latestHouseMembership.membershipFrom,
        party: mp.latestParty.name,
        image: mp.thumbnailUrl,
        email: `${mp.nameDisplayAs.replace(/\s/g, '.').toLowerCase()}@parliament.uk`,
        phone: '020 7219 3000', // Static as a placeholder
        postcodes: ['SW1A 0AA'], // Placeholder
        addresses: [{
            type: 'Parliamentary',
            fullAddress: 'House of Commons, Westminster, London SW1A 0AA',
        }],
    }));

    // Save to mps.json
    fs.writeFile('public/data/mps.json', JSON.stringify(transformedData, null, 2), 'utf8', err => {
        if (err) {
            console.error('Error writing file', err);
        } else {
            console.log('MP data updated successfully.');
        }
    });
});
