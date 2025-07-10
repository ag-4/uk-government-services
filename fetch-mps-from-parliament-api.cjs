// Fetches all current UK MPs from the official Parliament API and outputs a clean mps.json
// Includes: name, party, constituency, email, phone, and image
const fs = require('fs');
const path = require('path');
const https = require('https');

const API_URL = 'https://members-api.parliament.uk/api/Members/Search?House=Commons&IsCurrentMember=true&skip=0&take=650';
const OUTPUT_FILE = path.join(__dirname, 'public', 'data', 'mps.json');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {headers: {'User-Agent': 'Node.js'}}, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function getContact(mp) {
  // Parliament API does not always provide email/phone, but try to extract if present
  let email = null, phone = null;
  if (mp && mp.value && mp.value.latestParty && mp.value.latestParty.email) email = mp.value.latestParty.email;
  if (mp && mp.value && mp.value.latestParty && mp.value.latestParty.phone) phone = mp.value.latestParty.phone;
  return { email, phone };
}

(async () => {
  try {
    console.log('🌐 Fetching MPs from Parliament API...');
    const data = await fetchJson(API_URL);
    if (!data || !data.items) throw new Error('No items in API response');
    const mps = data.items.map(mp => {
      const { value } = mp;
      return {
        id: value.id,
        name: value.nameFull,
        displayName: value.nameDisplayAs,
        party: value.latestParty && value.latestParty.name,
        partyAbbreviation: value.latestParty && value.latestParty.abbreviation,
        constituency: value.latestHouseMembership && value.latestHouseMembership.membershipFrom,
        constituencyId: value.latestHouseMembership && value.latestHouseMembership.membershipFromId,
        email: value.email,
        phone: value.phoneNumber,
        image: value.thumbnailUrl || (value.profileImageUrl ? value.profileImageUrl : null),
        // Parliament API does not provide postcodes directly
        // You may need to map postcodes to constituencies using an external dataset
      };
    });
    console.log(`✅ Fetched ${mps.length} MPs`);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mps, null, 2));
    console.log(`💾 Saved to ${OUTPUT_FILE}`);
    console.log('⚠️  Note: Postcodes are not included. You must map postcodes to constituencies using an external dataset.');
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
})();
