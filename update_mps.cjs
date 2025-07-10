
const axios = require('axios');
const fs = require('fs');

const fetchAllMPs = async () => {
  try {
    const response = await axios.get('https://members-api.parliament.uk/api/Members/Search', {
      params: {
        IsCurrentMember: true,
        skip: 0,
        take: 1000 // Fetch all current MPs
      }
    });
    return response.data.items.map(item => item.value);
  } catch (error) {
    console.error('Error fetching MPs:', error);
    return [];
  }
};

const fetchMPDetails = async (id) => {
  try {
    const response = await axios.get(`https://members-api.parliament.uk/api/Members/${id}`);
    return response.data.value;
  } catch (error) {
    console.error(`Error fetching details for MP ${id}:`, error);
    return null;
  }
};

const updateMPDatabase = async () => {
  console.log('Fetching all current MPs...');
  const mps = await fetchAllMPs();
  const updatedMPs = [];

  for (const mp of mps) {
    console.log(`Fetching details for ${mp.name}...`);
    const details = await fetchMPDetails(mp.id);
    if (details) {
      updatedMPs.push({
        id: `MP${details.id}`,
        parliamentId: details.id,
        name: details.nameDisplayAs,
        displayName: details.nameFullTitle,
        fullTitle: details.nameFullTitle,
        constituency: details.latestParty.name,
        constituencyId: details.latestParty.id,
        party: details.latestParty.name,
        partyAbbreviation: details.latestParty.abbreviation,
        partyColor: '909090', // Default color
        gender: details.gender,
        membershipStartDate: details.latestHouseMembership.membershipStartDate,
        isActive: details.latestHouseMembership.membershipStatus.statusIsActive,
        email: null,
        phone: null,
        website: null,
        addresses: [],
        biography: '',
        thumbnailUrl: details.thumbnailUrl,
        postcodes: [],
        constituencyPostcodes: [],
        committees: [],
        experience: [],
        socialMedia: {}
      });
    }
  }

  fs.writeFileSync('public/mps_updated.json', JSON.stringify(updatedMPs, null, 2));
  console.log('MP database updated successfully!');
};

updateMPDatabase();
